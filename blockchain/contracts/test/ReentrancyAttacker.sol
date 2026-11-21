// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

interface ISignovaSmartAccount {
    function executeProposal(uint256 proposalId) external returns (bytes memory);
}

contract ReentrancyAttacker {
    bool public reentryBlocked;

    function attack(address account, uint256 proposalId) external {
        try ISignovaSmartAccount(account).executeProposal(proposalId) {
            reentryBlocked = false;
        } catch {
            reentryBlocked = true;
        }
    }
}