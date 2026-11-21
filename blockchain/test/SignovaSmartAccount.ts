import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { encodeFunctionData, parseAbi } from "viem";

describe("SignovaSmartAccount", async function () {
  const { viem, networkHelpers } = await network.create();
  const wallets = await viem.getWalletClients();

  const signer1 = wallets[0].account.address;
  const signer2 = wallets[1].account.address;
  const signer3 = wallets[2].account.address;
  const nonSigner = wallets[3].account.address;
  const target = wallets[4].account.address;
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const receiverAbi = parseAbi([
    "function setValue(uint256 newValue)",
    "function revertCall()",
  ]);

  // getProposal's return type is not inferred correctly by the current
  // Hardhat/Viem TypeScript setup, so define the tuple shape explicitly.
  type ProposalTuple = readonly [
    string,
    bigint,
    string,
    string,
    bigint,
    bigint,
    boolean,
  ];

  async function deploy() {
    return viem.deployContract("SignovaSmartAccount", [
      [signer1, signer2, signer3],
      2n,
    ]);
  }

  // -------------------------
  // Constructor
  // -------------------------

  it("deploys with valid signers and threshold", async function () {
    const account = await deploy();
    assert.ok(account.address);
  });

  it("rejects an empty signer list", async function () {
    await assert.rejects(async () => {
      await viem.deployContract("SignovaSmartAccount", [[], 1n]);
    });
  });

  it("rejects a zero-address signer", async function () {
    await assert.rejects(async () => {
      await viem.deployContract("SignovaSmartAccount", [
        [signer1, zeroAddress],
        1n,
      ]);
    });
  });

  it("rejects duplicate signers", async function () {
    await assert.rejects(async () => {
      await viem.deployContract("SignovaSmartAccount", [
        [signer1, signer1],
        1n,
      ]);
    });
  });

  it("rejects a threshold of zero", async function () {
    await assert.rejects(async () => {
      await viem.deployContract("SignovaSmartAccount", [
        [signer1, signer2],
        0n,
      ]);
    });
  });

  it("rejects a threshold greater than signer count", async function () {
    await assert.rejects(async () => {
      await viem.deployContract("SignovaSmartAccount", [
        [signer1, signer2],
        3n,
      ]);
    });
  });

  // -------------------------
  // Signer access
  // -------------------------

   it("returns signers by index", async function () {
    const account = await deploy();

    const returnedSigner1 = (await account.read.getSigner([0n])) as string;
    const returnedSigner2 = (await account.read.getSigner([1n])) as string;
    const returnedSigner3 = (await account.read.getSigner([2n])) as string;

    assert.equal(returnedSigner1.toLowerCase(), signer1.toLowerCase());
    assert.equal(returnedSigner2.toLowerCase(), signer2.toLowerCase());
    assert.equal(returnedSigner3.toLowerCase(), signer3.toLowerCase());
  });
   
    // -------------------------
  // Proposal creation
  // -------------------------

  it("creates a proposal and records the proposer's approval", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[0].toLowerCase(), target.toLowerCase());
    assert.equal(proposal[1], 0n);
    assert.equal(proposal[3].toLowerCase(), signer1.toLowerCase());
    assert.equal(proposal[4], 1n);
    assert.equal(proposal[6], false);
  });

  it("rejects a proposal from a non-signer", async function () {
    const account = await deploy();

    await assert.rejects(async () => {
      await account.write.proposeTransaction(
        [target, 0n, "0x"],
        { account: wallets[3].account },
      );
    });
  });
   
    // -------------------------
  // Approval handling
  // -------------------------

  it("allows another signer to approve a proposal", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[4], 2n);
  });

  it("rejects duplicate approvals", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await assert.rejects(async () => {
      await account.write.approveProposal([0n], {
        account: wallets[1].account,
      });
    });
  });

  it("rejects approval from a non-signer", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await assert.rejects(async () => {
      await account.write.approveProposal([0n], {
        account: wallets[3].account,
      });
    });
  });
  
    // -------------------------
  // Approval revocation
  // -------------------------

  it("allows a signer to revoke their approval", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.revokeApproval([0n]);

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[4], 0n);
  });

  it("decreases the approval count when another signer revokes", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await account.write.revokeApproval([0n], {
      account: wallets[1].account,
    });

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[4], 1n);
  });

  it("rejects revocation when the signer has not approved", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await assert.rejects(async () => {
      await account.write.revokeApproval([0n], {
        account: wallets[2].account,
      });
    });
  });

  it("rejects revocation from a non-signer", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await assert.rejects(async () => {
      await account.write.revokeApproval([0n], {
        account: wallets[3].account,
      });
    });
  });
  
    // -------------------------
  // Proposal expiry
  // -------------------------

  it("sets an expiration timestamp when a proposal is created", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.ok(proposal[5] > 0n);
  });
   
    // -------------------------
  // Execution security
  // -------------------------

  it("rejects execution when the approval threshold is not met", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await assert.rejects(async () => {
      await account.write.executeProposal([0n]);
    });
  });

    it("executes a proposal after the approval threshold is reached", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await account.write.executeProposal([0n]);

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[6], true);
  });

  it("allows execution from a non-signer when threshold is met", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);
    await account.write.approveProposal([0n], {
      account: signer2,
    });

    await account.write.executeProposal([0n], {
      account: nonSigner,
    });

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;
    assert.equal(proposal[6], true);
  });
  
    it("rejects executing the same proposal twice", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await account.write.executeProposal([0n]);

    await assert.rejects(async () => {
      await account.write.executeProposal([0n]);
    });
  });
 
    it("executes a real contract call and changes contract state", async function () {
    const account = await deploy();

    const receiver = await viem.deployContract("ExecutionReceiver");

    const data = encodeFunctionData({
      abi: receiverAbi,
      functionName: "setValue",
      args: [42n],
    });

    await account.write.proposeTransaction([
      receiver.address,
      0n,
      data,
    ]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await account.write.executeProposal([0n]);

    const storedValue = await receiver.read.storedValue();

    assert.equal(storedValue, 42n);
  });
  
    it("executes an ETH transfer after approvals", async function () {
    const account = await deploy();
    const receiver = await viem.deployContract("ExecutionReceiver");

    const amount = 100000000000000000n; // 0.1 ETH

    // Fund the Smart Account
    await wallets[0].sendTransaction({
      to: account.address,
      value: amount,
    });

    // Propose the ETH transfer
    await account.write.proposeTransaction([
      receiver.address,
      amount,
      "0x",
    ]);

    // Get the required second approval
    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    // Execute
    await account.write.executeProposal([0n]);

    // Verify receiver got the ETH
    const publicClient = await viem.getPublicClient();
    const balance = await publicClient.getBalance({
      address: receiver.address,
     });
    assert.equal(balance, amount);
  });

    it("does not mark a proposal executed when the target call fails", async function () {
    const account = await deploy();
    const receiver = await viem.deployContract("ExecutionReceiver");

    const data = encodeFunctionData({
      abi: receiverAbi,
      functionName: "revertCall",
    });

    await account.write.proposeTransaction([
      receiver.address,
      0n,
      data,
    ]);

    await account.write.approveProposal([0n], {
      account: wallets[1].account,
    });

    await assert.rejects(async () => {
      await account.write.executeProposal([0n]);
    });

    const proposal = (await account.read.getProposal([0n])) as unknown as ProposalTuple;

    assert.equal(proposal[6], false);
  });
  
    it("rejects execution of an expired proposal", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await networkHelpers.time.increase(7 * 24 * 60 * 60 + 1);

    await assert.rejects(async () => account.write.executeProposal([0n]));
  });
  
    it("rejects approval of an expired proposal", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await networkHelpers.time.increase(7 * 24 * 60 * 60 + 1);

    await assert.rejects(async () =>
      account.write.approveProposal([0n], {
        account: signer2,
      }),
    );
  });

   

  it("rejects revocation of an expired proposal", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);
    await networkHelpers.time.increase(7 * 24 * 60 * 60 + 1);

    await assert.rejects(async () => account.write.revokeApproval([0n]));
  });

  it("allows execution at the exact expiration timestamp", async function () {
    const account = await deploy();

    await account.write.proposeTransaction([target, 0n, "0x"]);

    await account.write.approveProposal([0n], {
      account: signer2,
    });

    const proposal = await account.read.getProposal([0n]);
    const expiry = Number(proposal[5]);

    await networkHelpers.time.setNextBlockTimestamp(expiry);

    await account.write.executeProposal([0n]);
  });

  it("blocks reentrant execution", async function () {
  const account = await deploy();

  const attacker = await viem.deployContract("ReentrancyAttacker");

  const proposalId = await account.write.proposeTransaction([
    attacker.address,
    0n,
    encodeFunctionData({
      abi: parseAbi(["function attack(address account, uint256 proposalId)"]),
      functionName: "attack",
      args: [account.address, 0n],
    }),
  ]);

  await account.write.approveProposal([0n], {
    account: wallets[1].account,
  });

  await account.write.executeProposal([0n]);

  const blocked = await attacker.read.reentryBlocked();

  assert.equal(blocked, true);
});
});


   