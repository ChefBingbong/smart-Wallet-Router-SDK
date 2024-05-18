import { decodeAbiParameters, decodeFunctionData, parseAbiItem, toFunctionSignature } from "viem";

const abi = parseAbiItem(
     "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to)",
);
// const values = decodeAbiParameters(
//      [
//           { internalType: "uint256", name: "amountIn", type: "uint256" },
//           { internalType: "uint256", name: "amountOutMin", type: "uint256" },
//           { internalType: "address[]", name: "path", type: "address[]" },
//           { internalType: "address", name: "to", type: "address" },
//      ],

//      "0x472b43f30000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000018eae5bcad54a0550000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c39d95f6156b2ecb9977bcc75ca677a80e06c60d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000501b55184813f7a29eb98decd8ec9b6d07deb2630000000000000000000000006f451eb92d7de92ddf6939d9efce6799246b3a4b",
// );
function main() {
     console.log(abi);
     const d = toFunctionSignature(abi);
     const res = decodeFunctionData({
          abi: [abi],
          data: "0x472b43f30000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000018eae5bcad54a0550000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c39d95f6156b2ecb9977bcc75ca677a80e06c60d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000501b55184813f7a29eb98decd8ec9b6d07deb2630000000000000000000000006f451eb92d7de92ddf6939d9efce6799246b3a4b",
     });

     console.log(res);
}

main();