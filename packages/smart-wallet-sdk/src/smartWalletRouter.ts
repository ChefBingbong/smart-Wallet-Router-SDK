/* eslint-disable lines-between-class-members */
import type { ChainId } from "@pancakeswap/chains";
import { getTokenPrices } from "@pancakeswap/price-api-sdk";
import { CurrencyAmount, type Currency, type Token, type TradeType } from "@pancakeswap/sdk";
import { SwapRouter, type SmartRouterTrade, type SwapOptions } from "@pancakeswap/smart-router";
import {
     PancakeSwapUniversalRouter as UniversalRouter,
     getUniversalRouterAddress,
     type PancakeSwapOptions,
} from "@pancakeswap/universal-router-sdk";
import type { BaseError } from "abitype";
import { ethers } from "ethers";
import { erc20Abi as ERC20ABI, formatTransactionRequest, type Address, type Hex, type PublicClient } from "viem";
import { bscTestnet } from "viem/chains";
import { getContractError, getTransactionError, parseAccount } from "viem/utils";
import { smartWalletAbi } from "./abis/SmartWalletAbi";
import { Routers } from "./encoder/buildOperation";
import { OperationType, WalletOperationBuilder, encodeOperation } from "./encoder/walletOperations";
import { permit2TpedData } from "./permit/permit2TypedData";
import { getEthersProvider, getViemClient } from "./provider/client";
import { getPublicClient, getWalletClient } from "./provider/walletClient";
import { ClasicTrade } from "./trades/classicTrade";
import type { ECDSAExecType } from "./types/eip712";
import type {
     ClassicTradeOptions,
     PackedAllowance,
     SmartWalletGasParams,
     SmartWalletTradeOptions,
     UserOp,
     WalletAllownceDetails,
} from "./types/smartWallet";
import { getSmartWallet, getSmartWalletFactory } from "./utils/contracts";
import { AccountNotFoundError } from "./utils/error";
import { getNativeWrappedToken, getTokenPriceByNumber, getUsdGasToken } from "./utils/estimateGas";
import { getSwapRouterAddress } from "./utils/getSwapRouterAddress";
import { typedMetaTx } from "./utils/typedMetaTx";

function calculateGasMargin(value: bigint, margin = 1000n): bigint {
     return (value * (10000n + margin)) / 10000n;
}
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export abstract class SmartWalletRouter {
     public static account: Address;
     public static smartWallet: Address;
     public static chainId: ChainId;
     public static isInitialized = false;

     public static tradeConfig: Partial<ClassicTradeOptions<PancakeSwapOptions>> & SmartRouterTrade<TradeType> =
          {} as Partial<ClassicTradeOptions<PancakeSwapOptions>> & SmartRouterTrade<TradeType>;

     public static updateConfig(config: SmartWalletTradeOptions) {
          SmartWalletRouter.account = config.account;
          SmartWalletRouter.smartWallet = config.smartWalletDetails.address;
          SmartWalletRouter.chainId = config.chainId;
     }

     public static buildClassicTrade<UTradeOps extends SwapOptions & PancakeSwapOptions>(
          trade: SmartRouterTrade<TradeType>,
          options: ClassicTradeOptions<UTradeOps>,
     ) {
          SmartWalletRouter.tradeConfig = { ...options, ...trade };
          const routeOptions = options.underlyingTradeOptions;
          if (options.router === Routers.UniversalRouter) {
               const { value, calldata } = UniversalRouter.swapERC20CallParameters(trade, routeOptions);
               const swapRouterAddress = getUniversalRouterAddress(options.chainId);
               return { address: swapRouterAddress, calldata, value };
          }

          const { value, calldata } = SwapRouter.swapCallParameters(trade, routeOptions);
          const swapRouterAddress = getSwapRouterAddress(options.chainId);
          return { address: swapRouterAddress, calldata, value };
     }

     public static buildSmartWalletTrade(trade: SmartRouterTrade<TradeType>, options: SmartWalletTradeOptions) {
          SmartWalletRouter.tradeConfig = { ...options, ...trade };

          const planner = new WalletOperationBuilder(options.chainId);
          const tradeCommand = new ClasicTrade(trade, options);
          tradeCommand.encode(planner);

          return SmartWalletRouter.encodePlan(planner, options);
     }

     public static encodePlan(planner: WalletOperationBuilder, config: SmartWalletTradeOptions) {
          const { userOps, bridgeOps, externalUserOps } = planner;
          const { address, nonce } = config.smartWalletDetails;

          const chainId = BigInt(config.chainId);
          const { inputAsset, feeAsset } = config.assets;
          const { permitData } = permit2TpedData([inputAsset, feeAsset], address, [
               BigInt(config.allowance.t0nonce),
               BigInt(config.allowance.t1nonce),
          ]);
          const smartWalletTypedData = typedMetaTx(
               userOps,
               bridgeOps,
               permitData,
               nonce,
               chainId,
               chainId,
               chainId,
               address,
          );
          return {
               smartWalletTypedData,
               externalUserOps,
               config: config,
          };
     }

     public static async sendTransactionFromRelayer(
          chainId: ChainId,
          txConfig: UserOp,
          config?: { externalClient?: PublicClient },
     ) {
          const asyncClient = getPublicClient({ chainId });
          const externalClient = config?.externalClient;
          const client = externalClient || getWalletClient({ chainId });

          if (!client.account) throw new AccountNotFoundError();
          const account = parseAccount(client.account);

          try {
               const gasPrice = await asyncClient.getGasPrice();
               const gasE = await asyncClient.estimateGas({
                    to: txConfig.to,
                    value: txConfig.amount,
                    data: txConfig.data,
                    account,
               });

               const tradeMeta = await client.prepareTransactionRequest({
                    to: txConfig.to,
                    value: txConfig.amount,
                    data: txConfig.data,
                    chain: bscTestnet,
                    gas: calculateGasMargin(gasE),
                    gasPrice,
                    account,
               });
               const chainFormat = client.chain?.formatters?.transactionRequest?.format;
               const format = chainFormat || formatTransactionRequest;

               if (account.type === "local" && externalClient) {
                    const serializer = client.chain?.serializers?.transaction;
                    const signedTx = await account.signTransaction(format(tradeMeta), { serializer });
                    const txHash = await client.sendRawTransaction({
                         serializedTransaction: signedTx,
                    });
                    return await asyncClient.waitForTransactionReceipt({
                         hash: txHash,
                         confirmations: 2,
                    });
               }

               const txHash = await client.sendTransaction({ ...tradeMeta });
               return await asyncClient.waitForTransactionReceipt({
                    hash: txHash,
                    confirmations: 1,
               });
          } catch (error: unknown) {
               console.log(error);
               const errParams = { ...txConfig, account: client.account };
               throw getTransactionError(error as BaseError, errParams);
          }
     }

     public static async estimateSmartWalletFees({
          feeAsset,
          inputCurrency,
          outputCurrency,
          chainId,
     }: SmartWalletGasParams): Promise<{
          gasEstimate: bigint;
          gasCostInNative: CurrencyAmount<Token>;
          gasCostInQuoteToken: CurrencyAmount<Currency>;
          gasCostInBaseToken: CurrencyAmount<Currency>;
          gasCostInUSD: CurrencyAmount<Currency>;
          gasCost: CurrencyAmount<Currency>;
     }> {
          const publicClient = getPublicClient({ chainId: 56 });
          const usdToken = getUsdGasToken(56);
          if (!usdToken) {
               throw new Error(`No valid usd token found on chain ${chainId}`);
          }
          const nativeWrappedToken = getNativeWrappedToken(56);
          if (!nativeWrappedToken) {
               throw new Error(`Unsupported chain ${chainId}. Native wrapped token not found.`);
          }

          const [quoteCurrencyUsdPrice, baseCurrencyUsdPrice, nativeCurrencyUsdPrice] = await getTokenPrices(56, [
               "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
               "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
               nativeWrappedToken.address,
          ]);

          const quotePriceInUsd = getTokenPriceByNumber(usdToken, outputCurrency, quoteCurrencyUsdPrice?.priceUSD);
          const basePriceInUsd = getTokenPriceByNumber(usdToken, inputCurrency, baseCurrencyUsdPrice?.priceUSD);
          const nativePriceInUsd = getTokenPriceByNumber(
               usdToken,
               nativeWrappedToken,
               nativeCurrencyUsdPrice?.priceUSD,
          );

          const quotePriceInNative =
               quotePriceInUsd && nativePriceInUsd ? nativePriceInUsd.multiply(quotePriceInUsd.invert()) : undefined;

          const basePriceInNative =
               basePriceInUsd && nativePriceInUsd ? nativePriceInUsd.multiply(basePriceInUsd.invert()) : undefined;

          //cant estimate the SW exec itself because we need signature to pass ec recovery
          // 50000 is accurate average estimation of its cost
          const estimationOfSmartWalletBatchExec = 283498n;
          const gasPrice = await publicClient.getGasPrice();
          const baseGasCostWei = gasPrice * estimationOfSmartWalletBatchExec;
          const totalGasCostNativeCurrency = CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei);

          let gasCostInQuoteToken: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(outputCurrency, 0n);
          let gasCostInBaseToken: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(outputCurrency, 0n);
          let gasCostInUSD: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(usdToken, 0n);

          if (inputCurrency.isNative) gasCostInBaseToken = totalGasCostNativeCurrency;
          if (outputCurrency.isNative) gasCostInQuoteToken = totalGasCostNativeCurrency;

          if (!inputCurrency.isNative && !outputCurrency.isNative && quotePriceInNative && basePriceInNative) {
               gasCostInQuoteToken = quotePriceInNative.quote(totalGasCostNativeCurrency);
               gasCostInBaseToken = basePriceInNative.quote(totalGasCostNativeCurrency);
          }

          if (nativePriceInUsd) {
               gasCostInUSD = nativePriceInUsd.quote(totalGasCostNativeCurrency);
          }

          const gasCost = feeAsset === inputCurrency.symbol ? gasCostInBaseToken : gasCostInQuoteToken;
          return {
               gasEstimate: estimationOfSmartWalletBatchExec,
               gasCostInNative: totalGasCostNativeCurrency,
               gasCostInQuoteToken,
               gasCostInBaseToken,
               gasCostInUSD,
               gasCost,
          };
     }

     public static async getContractAllowance(
          tokens: Address[],
          owner: Address,
          spender: Address,
          chainId: ChainId,
          amount: bigint,
     ): Promise<WalletAllownceDetails> {
          try {
               const client = getViemClient({ chainId });

               const [[, , t0nonce], [, , t1nonce]] = (await client.multicall({
                    contracts: [
                         ...tokens.map((token) => ({
                              functionName: "allowance",
                              args: [owner, token, spender],
                              address: spender,
                              abi: smartWalletAbi,
                         })),
                    ],
                    allowFailure: false,
               })) as unknown as [PackedAllowance, PackedAllowance];

               const allowances = (await client.multicall({
                    contracts: [
                         ...tokens.map((token) => ({
                              functionName: "allowance",
                              args: [owner, spender],
                              address: token,
                              abi: ERC20ABI,
                         })),
                    ],
                    allowFailure: false,
               })) as [bigint, bigint];

               const [t0Allowance, t1Allowance] = allowances.map((all) => {
                    if (all < amount) return { allowance: all, needsApproval: false };
                    return { allowance: all, needsApproval: true };
               });

               return { t0Allowance, t1Allowance, t0nonce, t1nonce };
          } catch (error) {
               console.log(
                    getContractError(error as BaseError, {
                         abi: ERC20ABI,
                         address: tokens[0],
                         args: [owner, spender],
                         functionName: "allowance",
                    }),
               );

               return {
                    t0Allowance: { allowance: 0n, needsApproval: false },
                    t1Allowance: {
                         allowance: 0n,
                         needsApproval: false,
                    },
                    t0nonce: 0,
                    t1nonce: 0,
               };
          }
     }

     public static async encodeWalletCreationOp(args: [Address], to: Address) {
          const { encodedSelector, encodedInput } = encodeOperation(OperationType.CREATE_WALLET, args);
          const operationCalldata = encodedSelector.concat(encodedInput.substring(2)) as Hex;
          return { to, amount: 1.5 * 10 ** 9, data: operationCalldata };
     }

     public static async encodeSmartRouterTrade(args: [ECDSAExecType, Hex], to: Address, chainId: ChainId) {
          const provider = getEthersProvider(chainId);
          const smartWalletContract = new ethers.Contract(to, smartWalletAbi, provider);
          const callData = await smartWalletContract.populateTransaction.exec(args[0], args[1]);
          return { to, amount: 0n, data: callData.data };
     }

     public static async getUserSmartWalletDetails(userAddress: Address, chainId: ChainId) {
          const publicClient = getPublicClient({ chainId });
          const factory = getSmartWalletFactory(chainId);

          const address = await factory.read.walletAddress([userAddress, BigInt(0)]);
          const smartWallet = getSmartWallet(chainId, address);
          try {
               const code = await publicClient.getBytecode({ address });
               const nonce = code !== "0x" ? await smartWallet.read.nonce() : BigInt(0);
               return { address, nonce, wallet: smartWallet };
          } catch (error) {
               console.log(error);
               return { address, nonce: 0n, wallet: smartWallet };
          }
     }
}
