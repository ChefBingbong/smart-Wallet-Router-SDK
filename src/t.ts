import { decodeFunctionData, erc20Abi, toFunctionHash, toFunctionSelector, toFunctionSignature } from "viem";

function main() {
      try {
            const f = decodeFunctionData({
                  data: "0x472b43f30000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000018eae5bcae367a090000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c39d95f6156b2ecb9977bcc75ca677a80e06c60d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000501b55184813f7a29eb98decd8ec9b6d07deb2630000000000000000000000006f451eb92d7de92ddf6939d9efce6799246b3a4b",
                  abi: erc20Abi,
            });
      } catch (err) {}

      console.log("heyyyyyy");
}

main();