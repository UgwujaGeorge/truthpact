import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("TruthPact", function () {
  async function deployFixture() {
    const [client, worker, judge] = await ethers.getSigners();
    const truthPact = await ethers.deployContract("TruthPact");
    await truthPact.waitForDeployment();

    const deadline = (await time.latest()) + 3600;
    const escrowAmount = ethers.parseEther("0.25");

    return { truthPact, client, worker, judge, deadline, escrowAmount };
  }

  it("creates and funds a pact", async function () {
    const { truthPact, worker, judge, deadline, escrowAmount } = await loadFixture(deployFixture);

    await expect(
      truthPact.createPact(worker.address, judge.address, "Design a hero section", escrowAmount, deadline),
    )
      .to.emit(truthPact, "PactCreated")
      .withArgs(0, await (await ethers.getSigners())[0].getAddress(), worker.address, judge.address, escrowAmount, deadline);

    await expect(truthPact.fundPact(0, { value: escrowAmount })).to.emit(truthPact, "PactFunded").withArgs(0, escrowAmount);

    const pact = await truthPact.getPact(0);
    expect(pact.status).to.equal(1n);
  });

  it("submits work and approves payment", async function () {
    const { truthPact, client, worker, judge, deadline, escrowAmount } = await loadFixture(deployFixture);

    await truthPact.createPact(worker.address, judge.address, "Build a dashboard", escrowAmount, deadline);
    await truthPact.connect(client).fundPact(0, { value: escrowAmount });

    await expect(truthPact.connect(worker).submitWork(0, "ipfs://work", "Completed dashboard"))
      .to.emit(truthPact, "WorkSubmitted")
      .withArgs(0, "ipfs://work", "Completed dashboard");

    await expect(() => truthPact.connect(judge).approvePact(0)).to.changeEtherBalances(
      [worker, truthPact],
      [escrowAmount, -escrowAmount],
    );

    const pact = await truthPact.getPact(0);
    expect(pact.status).to.equal(3n);
  });

  it("rejects work and refunds the client", async function () {
    const { truthPact, client, worker, judge, deadline, escrowAmount } = await loadFixture(deployFixture);

    await truthPact.createPact(worker.address, judge.address, "Verify a report", escrowAmount, deadline);
    await truthPact.connect(client).fundPact(0, { value: escrowAmount });
    await truthPact.connect(worker).submitWork(0, "", "This should fail");

    await expect(() => truthPact.connect(judge).rejectPact(0)).to.changeEtherBalances(
      [client, truthPact],
      [escrowAmount, -escrowAmount],
    );

    const pact = await truthPact.getPact(0);
    expect(pact.status).to.equal(4n);
  });

  it("allows the client to refund after deadline", async function () {
    const { truthPact, client, worker, judge, deadline, escrowAmount } = await loadFixture(deployFixture);

    await truthPact.createPact(worker.address, judge.address, "Create a deck", escrowAmount, deadline);
    await truthPact.connect(client).fundPact(0, { value: escrowAmount });

    await time.increaseTo(deadline + 1);

    await expect(() => truthPact.connect(client).refundExpiredPact(0)).to.changeEtherBalances(
      [client, truthPact],
      [escrowAmount, -escrowAmount],
    );

    const pact = await truthPact.getPact(0);
    expect(pact.status).to.equal(5n);
  });
});
