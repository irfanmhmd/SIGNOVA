// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract ExecutionReceiver {
    uint256 public storedValue;

    event ValueUpdated(uint256 newValue);
    event FundsReceived(address sender, uint256 amount);

    function setValue(uint256 newValue) external {
        storedValue = newValue;
        emit ValueUpdated(newValue);
    }

    function revertCall() external pure {
        revert("ExecutionReceiver: intentional revert");
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}