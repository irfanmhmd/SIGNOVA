
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract SignovaSmartAccount {
    mapping(address => bool) public isSigner;
    address[] public signers;

    uint256 public requiredApprovals;
    uint256 public proposalCount;

    uint256 public constant PROPOSAL_LIFETIME = 7 days;

    struct Proposal {
        address target;
        uint256 value;
        bytes data;
        address proposer;
        uint256 approvalCount;
        uint256 expiresAt;
        bool executed;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public approvals;

    bool private executionLock;

    error NoSignersProvided();
    error InvalidSigner(address signer);
    error DuplicateSigner(address signer);
    error InvalidApprovalThreshold();
    error NotSigner(address caller);
    error InvalidTarget();
    error ProposalNotFound(uint256 proposalId);
    error AlreadyApproved(uint256 proposalId, address signer);
    error NotApproved(uint256 proposalId, address signer);
    error ProposalAlreadyExecuted(uint256 proposalId);
    error ProposalExpired(uint256 proposalId);
    error InsufficientApprovals(uint256 proposalId);
    error Reentrancy();
    error ExecutionFailed(uint256 proposalId, bytes returnData);

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address indexed target,
        uint256 value,
        bytes data,
        uint256 expiresAt
    );

    event ProposalApproved(uint256 indexed proposalId, address indexed signer);
    event ApprovalRevoked(uint256 indexed proposalId, address indexed signer);

    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor,
        address indexed target,
        uint256 value
    );

    constructor(address[] memory initialSigners, uint256 _requiredApprovals) {
        if (initialSigners.length == 0) revert NoSignersProvided();

        if (
            _requiredApprovals == 0 ||
            _requiredApprovals > initialSigners.length
        ) {
            revert InvalidApprovalThreshold();
        }

        for (uint256 i = 0; i < initialSigners.length; i++) {
            address signer = initialSigners[i];

            if (signer == address(0)) revert InvalidSigner(signer);
            if (isSigner[signer]) revert DuplicateSigner(signer);

            isSigner[signer] = true;
            signers.push(signer);
        }

        requiredApprovals = _requiredApprovals;
    }

    modifier onlySigner() {
        if (!isSigner[msg.sender]) revert NotSigner(msg.sender);
        _;
    }

    receive() external payable {}

    function proposeTransaction(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlySigner returns (uint256 proposalId) {
        if (target == address(0)) revert InvalidTarget();

        proposalId = proposalCount;
        proposalCount++;

        uint256 expiry = block.timestamp + PROPOSAL_LIFETIME;

        Proposal storage proposal = proposals[proposalId];

        proposal.target = target;
        proposal.value = value;
        proposal.data = data;
        proposal.proposer = msg.sender;
        proposal.approvalCount = 1;
        proposal.expiresAt = expiry;
        proposal.executed = false;
        proposal.exists = true;

        approvals[proposalId][msg.sender] = true;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            target,
            value,
            data,
            expiry
        );

        emit ProposalApproved(proposalId, msg.sender);
    }

    function approveProposal(uint256 proposalId) external onlySigner {
        Proposal storage proposal = proposals[proposalId];

        if (!proposal.exists) revert ProposalNotFound(proposalId);
        if (proposal.executed) revert ProposalAlreadyExecuted(proposalId);
        if (block.timestamp > proposal.expiresAt) revert ProposalExpired(proposalId);
        if (approvals[proposalId][msg.sender]) {
            revert AlreadyApproved(proposalId, msg.sender);
        }

        approvals[proposalId][msg.sender] = true;
        proposal.approvalCount++;

        emit ProposalApproved(proposalId, msg.sender);
    }

    function revokeApproval(uint256 proposalId) external onlySigner {
        Proposal storage proposal = proposals[proposalId];

        if (!proposal.exists) revert ProposalNotFound(proposalId);
        if (proposal.executed) revert ProposalAlreadyExecuted(proposalId);
        if (block.timestamp > proposal.expiresAt) revert ProposalExpired(proposalId);
        if (!approvals[proposalId][msg.sender]) {
            revert NotApproved(proposalId, msg.sender);
        }

        approvals[proposalId][msg.sender] = false;
        proposal.approvalCount--;

        emit ApprovalRevoked(proposalId, msg.sender);
    }

    function executeProposal(uint256 proposalId) external returns (bytes memory returnData) {
        if (executionLock) revert Reentrancy();

        Proposal storage proposal = proposals[proposalId];

        if (!proposal.exists) revert ProposalNotFound(proposalId);
        if (proposal.executed) revert ProposalAlreadyExecuted(proposalId);
        if (block.timestamp > proposal.expiresAt) revert ProposalExpired(proposalId);
        if (proposal.approvalCount < requiredApprovals) {
            revert InsufficientApprovals(proposalId);
        }

        // Effects before interaction: prevent reentrancy and replay.
        executionLock = true;
        proposal.executed = true;

        (bool success, bytes memory result) = proposal.target.call{value: proposal.value}(proposal.data);

        if (!success) {
            revert ExecutionFailed(proposalId, result);
        }

        executionLock = false;

        emit ProposalExecuted(
            proposalId,
            msg.sender,
            proposal.target,
            proposal.value
        );

        return result;
    }

    function hasApproved(uint256 proposalId, address signer) external view returns (bool) {
        return approvals[proposalId][signer];
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (
            address target,
            uint256 value,
            bytes memory data,
            address proposer,
            uint256 approvalCount,
            uint256 expiresAt,
            bool executed
        )
    {
        Proposal storage proposal = proposals[proposalId];

        if (!proposal.exists) revert ProposalNotFound(proposalId);

        return (
            proposal.target,
            proposal.value,
            proposal.data,
            proposal.proposer,
            proposal.approvalCount,
            proposal.expiresAt,
            proposal.executed
        );
    }

    function getApprovalCount(uint256 proposalId) external view returns (uint256) {
        if (!proposals[proposalId].exists) revert ProposalNotFound(proposalId);
        return proposals[proposalId].approvalCount;
    }

    function isThresholdReached(uint256 proposalId) external view returns (bool) {
        if (!proposals[proposalId].exists) revert ProposalNotFound(proposalId);
        return proposals[proposalId].approvalCount >= requiredApprovals;
    }

    function getSignerCount() external view returns (uint256) {
        return signers.length;
    }

    function getSigner(uint256 index) external view returns (address) {
        return signers[index];
    }
}
