import { ChainId } from "@pancakeswap/sdk";
import type { Address } from "viem";

export enum Contracts {
  ECDSAWalletFactory = "ECDSAWalletFactory",
  SmartWalletFactory = "SmartWalletFactory",
  Depositor = "Depositor",
  Permit2 = "Permit2",
  NonceHelper = "NonceHelper",
  Cake = "Cake",
  Busd = "Busd",
  PancakeSwapV3Facotry = "PancakeSwapV3Facotry",
  WETH9 = "WETH9",
  PancakeSwapV2Facotry = "PancakeSwapV2Facotry",
}
export enum ExtendedChainId {
  POLYGON_TESTNET = 80001,
  LOCAL = 31337,
}
type Deployments = {
  [chain in ChainId | ExtendedChainId]: { [contract in Contracts]: Address };
};

export const polygonTokens = {
  weth: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
};

export const Deployments: Deployments = {
  [ExtendedChainId.POLYGON_TESTNET]: {
    ECDSAWalletFactory: "0xC6D72727dAD90e4711412e369aE67706d0EF7C02",
    SmartWalletFactory: "0xab381dB93d006bF653D62c1727D418f6E76a28e7",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ExtendedChainId.LOCAL]: {
    ECDSAWalletFactory: "0x39ffd48bDa47f53fD39D0d0D82291a9E4521f0E5",
    SmartWalletFactory: "0xC6885300c999a9C7E2913927E11eE95762CC85c9",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
    // weth: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  },
  [ChainId.ETHEREUM]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.GOERLI]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.BSC]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.BSC_TESTNET]: {
    //     ECDSAWalletFactory: "0xdEcC697485974455A97D2A7bc7e14d4B49eF7a76",
    //     SmartWalletFactory: "0x8f50F96C46B51c7a891AE876f5e78fB58B8260f0",
    //     ECDSAWalletFactory: "0xFA55Efcdf1a6555E318443B89c2DA7FD833c5B9b",
    //     SmartWalletFactory: "0x3fb03B90331CF32fE0ebf3689A97b4BFc2C3873C",
    ECDSAWalletFactory: "0x6b4Ec059199883dfE189E8f131d2e79044a52eA3",
    SmartWalletFactory: "0x518B14d78DF55F51508281F58352E1607177B685",
    Depositor: "0x",
    Permit2: "0x89b5B5d93245f543D53CC55923DF841349a65169",
    NonceHelper: "0x8756307d06955e029be44984D310fD060B1A5A2c",
    Cake: "0x501B55184813f7a29eb98DECD8EC9B6D07DEB263",
    Busd: "0x6F451Eb92d7dE92DdF6939d9eFCE6799246B3a4b",
    PancakeSwapV3Facotry: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    PancakeSwapV2Facotry: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    WETH9: "0xCE79F78537f95a2256e76A3FE4b99D3af148833F",
  }, //0x580b978cC31aDb5065f9e8401f076b7Da7eD4b4A
  [ChainId.ZKSYNC_TESTNET]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.ZKSYNC]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.OPBNB_TESTNET]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.OPBNB]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.POLYGON_ZKEVM]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    ECDSAWalletFactory: "0x4E06FBDb972F3473C4CD838156156F7B7dA0405D",
    SmartWalletFactory: "0x798e5A9A79f6229AB8792B5a98f2b49B1b3a3cF6",
    Depositor: "0x2BAF15BA3A2d06C763C03e17C15B9370C3c73b12",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },

  [ChainId.ARBITRUM_ONE]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.ARBITRUM_GOERLI]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    ECDSAWalletFactory: "0x6825CbF2702292eB45AF5B6b53f5BE57D8bc2D8c",
    SmartWalletFactory: "0x2842e1B6E93BC518b7aA065B500F4dF047992B52",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x4860ee416b52b4769CdC2E7876b09c6B77E3BD30",
    Busd: "0x903fC5f46287e7B3C79719c3ce8F4EDBAC8b8b54",
    PancakeSwapV3Facotry: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    PancakeSwapV2Facotry: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    WETH9: "0x62267B2BB09639053d85D03A0D38D89DA91ceD10",
  },
  [ChainId.SCROLL_SEPOLIA]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.LINEA]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.LINEA_TESTNET]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.BASE]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.BASE_TESTNET]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.BASE_SEPOLIA]: {
    ECDSAWalletFactory: "0x",
    SmartWalletFactory: "0x",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x",
    Busd: "0x",
    PancakeSwapV3Facotry: "0x",
    PancakeSwapV2Facotry: "0x",
    WETH9: "0x",
  },
  [ChainId.SEPOLIA]: {
    //     ECDSAWalletFactory: "0x7dF8BEaeD25fe010655Da27D7393A317e35C7361",
    //     SmartWalletFactory: "0xb5C56531Bdd3A05EC4901a30fF12c98Ef31925C5",
    ECDSAWalletFactory: "0xED6e16c022dc8FfF0c223Fd28758af5213285C1C",
    SmartWalletFactory: "0xF52b49508F4Be8d9070c5421c69bc6Ab609b8514",
    Depositor: "0x",
    Permit2: "0x",
    NonceHelper: "0x",
    Cake: "0x201873Ad6b36b16aAc7ed82273C41BF80Fc71A52",
    Busd: "0x63A9C123A57125BB53DB19A114b7C0AE80993c91",
    PancakeSwapV3Facotry: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    PancakeSwapV2Facotry: "0x1bdc540dEB9Ed1fA29964DeEcCc524A8f5e2198e",
    WETH9: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  },
};
