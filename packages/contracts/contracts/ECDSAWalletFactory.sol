//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "./ECDSAWallet.sol";
import "./SmartWalletFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPermit2} from "./permit2/interfaces/IPermit2.sol";
import {ISignatureTransfer} from "./permit2/interfaces/ISignatureTransfer.sol";
import {IAllowanceTransfer} from "./permit2/interfaces/IAllowanceTransfer.sol";

contract ECDSAWalletFactory is Ownable {
     SmartWalletFactory factory;
     ECDSAWallet wallet;

     using ECDSAUpgradeable for bytes32;
     using SafeERC20 for IERC20;
     IPermit2 public PERMIT2;
     ISignatureTransfer PermitBatchTransferFrom;
     IAllowanceTransfer PermitBatch;

     struct Witness {
          address user;
     }
     string private constant WITNESS_TYPE_STRING =
          "Witness witness)TokenPermissions(address token,uint256 amount)Witness(address user)";
     bytes32 private WITNESS_TYPEHASH = keccak256("Witness(address user)");

     mapping(address => mapping(address => uint256)) public tokenBalancesByUser;

     constructor(SmartWalletFactory _factory, address _permit2) {
          PERMIT2 = IPermit2(_permit2);

          wallet = new ECDSAWallet();
          wallet.__ECDSAWallet_init(address(0));

          factory = _factory;
     }

     function createWallet(address _owner) external payable returns (IWallet) {
          return
               factory.createWallet{value: msg.value}(
                    address(wallet),
                    abi.encodeWithSelector(ECDSAWallet.__ECDSAWallet_init.selector, _owner)
               );
     }

     function walletAddress(address _owner, uint256 _nonce) public view returns (address) {
          return
               factory.walletAddress(
                    address(wallet),
                    abi.encodeWithSelector(ECDSAWallet.__ECDSAWallet_init.selector, _owner),
                    _nonce
               );
     }

     function deposit(
          uint256 _amount,
          uint256 _feeAmount,
          address _token,
          address _feeToken,
          address _owner,
          address _user,
          IAllowanceTransfer.PermitBatch calldata _permit,
          bytes calldata _signature
     ) external {
          uint256 totalTransferAmount = _amount;
          if (_feeToken == _token) totalTransferAmount += _feeAmount;
          _increaseUserBalance(_user, _token, totalTransferAmount);
          //  ISignatureTransfer.SignatureTransferDetails[] memory s =  ISignatureTransfer.SignatureTransferDetails({to: address(this), requestedAmount: totalTransferAmount});
          //  ISignatureTransfer.SignatureTransferDetails memory s1 =  ISignatureTransfer.SignatureTransferDetails({to: address(this), requestedAmount: totalTransferAmount});
          //     ISignatureTransfer.SignatureTransferDetails[]
          //          memory detailsArray = new ISignatureTransfer.SignatureTransferDetails[](2);
          //     detailsArray[0] = (
          //          ISignatureTransfer.SignatureTransferDetails({to: address(this), requestedAmount: totalTransferAmount})
          //     );
          //     detailsArray[1] = (
          //          ISignatureTransfer.SignatureTransferDetails({to: address(this), requestedAmount: totalTransferAmount})
          //     );
          //     PERMIT2.permitWitnessTransferFrom(
          //          _permit,
          //          detailsArray,
          //          _user,
          //          keccak256(abi.encode(WITNESS_TYPEHASH, Witness(_owner))),
          //          WITNESS_TYPE_STRING,
          //          _signature
          //     );

          IAllowanceTransfer.AllowanceTransferDetails[]
               memory detailsArray = new IAllowanceTransfer.AllowanceTransferDetails[](2);
          detailsArray[0] = (
               IAllowanceTransfer.AllowanceTransferDetails({
                    from: _user,
                    to: address(this),
                    amount: uint160(_amount),
                    token: _token
               })
          );
          detailsArray[1] = (
               IAllowanceTransfer.AllowanceTransferDetails({
                    from: _user,
                    to: address(this),
                    amount: uint160(_amount),
                    token: _feeToken
               })
          );
          PERMIT2.permit(_user, _permit, _signature);
          PERMIT2.transferFrom(detailsArray);
          // PERMIT2.transferFrom(_user, address(this), uint160(_amount), _feeToken);

          //     address userWallet = walletAddress(_user, 0);
          //     tokenBalancesByUser[_user][_token] -= totalTransferAmount;

          //     IERC20(_token).safeTransfer(userWallet, _amount * 2);
          //     if (_feeToken == _token) IERC20(_token).safeTransfer(_owner, _feeAmount);
     }

     function _increaseUserBalance(address _account, address _token, uint256 _amount) internal {
          tokenBalancesByUser[_account][_token] += _amount;
     }
}
