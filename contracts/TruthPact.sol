// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TruthPact {
    enum PactStatus {
        Created,
        Funded,
        Submitted,
        Approved,
        Rejected,
        Refunded
    }

    struct Pact {
        address client;
        address worker;
        address judge;
        string prompt;
        uint256 escrowAmount;
        uint256 deadline;
        string workURI;
        string workText;
        PactStatus status;
        uint256 createdAt;
        uint256 judgedAt;
    }

    uint256 public pactCount;
    mapping(uint256 => Pact) private pacts;

    event PactCreated(
        uint256 indexed pactId,
        address indexed client,
        address indexed worker,
        address judge,
        uint256 escrowAmount,
        uint256 deadline
    );
    event PactFunded(uint256 indexed pactId, uint256 amount);
    event WorkSubmitted(uint256 indexed pactId, string workURI, string workText);
    event PactApproved(uint256 indexed pactId, address indexed worker, uint256 amount);
    event PactRejected(uint256 indexed pactId, address indexed client, uint256 amount);
    event PactRefunded(uint256 indexed pactId, address indexed client, uint256 amount);

    error PactNotFound();
    error NotClient();
    error NotWorker();
    error NotJudge();
    error InvalidAddress();
    error InvalidEscrowAmount();
    error InvalidDeadline();
    error InvalidStatus();
    error InvalidFundingAmount();
    error DeadlinePassed();
    error DeadlineNotReached();
    error EmptySubmission();

    modifier pactExists(uint256 pactId) {
        if (pactId >= pactCount) revert PactNotFound();
        _;
    }

    modifier onlyClient(uint256 pactId) {
        if (msg.sender != pacts[pactId].client) revert NotClient();
        _;
    }

    modifier onlyWorker(uint256 pactId) {
        if (msg.sender != pacts[pactId].worker) revert NotWorker();
        _;
    }

    modifier onlyJudge(uint256 pactId) {
        if (msg.sender != pacts[pactId].judge) revert NotJudge();
        _;
    }

    function createPact(
        address worker,
        address judge,
        string calldata prompt,
        uint256 escrowAmount,
        uint256 deadline
    ) external returns (uint256 pactId) {
        if (worker == address(0) || judge == address(0)) revert InvalidAddress();
        if (escrowAmount == 0) revert InvalidEscrowAmount();
        if (deadline <= block.timestamp) revert InvalidDeadline();

        pactId = pactCount;
        pacts[pactId] = Pact({
            client: msg.sender,
            worker: worker,
            judge: judge,
            prompt: prompt,
            escrowAmount: escrowAmount,
            deadline: deadline,
            workURI: "",
            workText: "",
            status: PactStatus.Created,
            createdAt: block.timestamp,
            judgedAt: 0
        });

        pactCount += 1;

        emit PactCreated(pactId, msg.sender, worker, judge, escrowAmount, deadline);
    }

    function fundPact(uint256 pactId) external payable pactExists(pactId) onlyClient(pactId) {
        Pact storage pact = pacts[pactId];

        if (pact.status != PactStatus.Created) revert InvalidStatus();
        if (block.timestamp > pact.deadline) revert DeadlinePassed();
        if (msg.value != pact.escrowAmount) revert InvalidFundingAmount();

        pact.status = PactStatus.Funded;

        emit PactFunded(pactId, msg.value);
    }

    function submitWork(
        uint256 pactId,
        string calldata workURI,
        string calldata workText
    ) external pactExists(pactId) onlyWorker(pactId) {
        Pact storage pact = pacts[pactId];

        if (pact.status != PactStatus.Funded) revert InvalidStatus();
        if (block.timestamp > pact.deadline) revert DeadlinePassed();
        if (bytes(workURI).length == 0 && bytes(workText).length == 0) revert EmptySubmission();

        pact.workURI = workURI;
        pact.workText = workText;
        pact.status = PactStatus.Submitted;

        emit WorkSubmitted(pactId, workURI, workText);
    }

    function approvePact(uint256 pactId) external pactExists(pactId) onlyJudge(pactId) {
        Pact storage pact = pacts[pactId];

        if (pact.status != PactStatus.Submitted) revert InvalidStatus();
        if (block.timestamp > pact.deadline) revert DeadlinePassed();

        pact.status = PactStatus.Approved;
        pact.judgedAt = block.timestamp;

        uint256 amount = pact.escrowAmount;
        (bool success, ) = payable(pact.worker).call{value: amount}("");
        require(success, "transfer failed");

        emit PactApproved(pactId, pact.worker, amount);
    }

    function rejectPact(uint256 pactId) external pactExists(pactId) onlyJudge(pactId) {
        Pact storage pact = pacts[pactId];

        if (pact.status != PactStatus.Submitted) revert InvalidStatus();
        if (block.timestamp > pact.deadline) revert DeadlinePassed();

        pact.status = PactStatus.Rejected;
        pact.judgedAt = block.timestamp;

        uint256 amount = pact.escrowAmount;
        (bool success, ) = payable(pact.client).call{value: amount}("");
        require(success, "transfer failed");

        emit PactRejected(pactId, pact.client, amount);
    }

    function refundExpiredPact(uint256 pactId) external pactExists(pactId) onlyClient(pactId) {
        Pact storage pact = pacts[pactId];

        if (
            pact.status != PactStatus.Created &&
            pact.status != PactStatus.Funded &&
            pact.status != PactStatus.Submitted
        ) revert InvalidStatus();
        if (block.timestamp <= pact.deadline) revert DeadlineNotReached();

        pact.status = PactStatus.Refunded;

        uint256 amount = pact.escrowAmount;
        if (amount > 0 && address(this).balance >= amount) {
            (bool success, ) = payable(pact.client).call{value: amount}("");
            require(success, "transfer failed");
        }

        emit PactRefunded(pactId, pact.client, amount);
    }

    function getPact(uint256 pactId) external view pactExists(pactId) returns (Pact memory) {
        return pacts[pactId];
    }
}

