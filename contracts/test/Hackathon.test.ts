import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { CreditCoinDemo, GFCPLoan } from "../typechain-types";

describe("Hackathon Scenario", function () {
  let cCTC: any;
  let loanContract: any;
  let admin: any;
  let user1: any;
  let user2: any;

  before(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const CreditCoinDemo = await ethers.getContractFactory("CreditCoinDemo");
    cCTC = await CreditCoinDemo.deploy();

    const GFCPLoan = await ethers.getContractFactory("GFCPLoan");
    loanContract = await GFCPLoan.deploy(await cCTC.getAddress());

    // Mint init pool
    await cCTC.mint(admin.address, ethers.parseUnits("50000", 18));
    await cCTC.transfer(await loanContract.getAddress(), ethers.parseUnits("10000", 18));
  });

  it("Should have correct initial pool balance", async function () {
    const poolBal = await loanContract.getAvailablePool();
    expect(poolBal).to.equal(ethers.parseUnits("10000", 18));
  });

  it("Admin should be able to set credit limits", async function () {
    const limit = ethers.parseUnits("500", 18);
    await loanContract.connect(admin).setUserCreditLimit(user1.address, limit);

    const user1Limit = await loanContract.userCreditLimits(user1.address);
    expect(user1Limit).to.equal(limit);
  });

  it("User cannot borrow without credit limit", async function () {
    const amount = ethers.parseUnits("100", 18);
    await expect(loanContract.connect(user2).requestLoan(amount)).to.be.revertedWith("No credit limit set");
  });

  it("User cannot borrow above credit limit", async function () {
    const amount = ethers.parseUnits("600", 18);
    await expect(loanContract.connect(user1).requestLoan(amount)).to.be.revertedWith("Exceeds max loan limit for user");
  });

  it("User can borrow within credit limit", async function () {
    const amount = ethers.parseUnits("200", 18);
    await loanContract.connect(user1).requestLoan(amount);

    const userWBal = await cCTC.balanceOf(user1.address);
    expect(userWBal).to.equal(amount);

    const poolBal = await loanContract.getAvailablePool();
    expect(poolBal).to.equal(ethers.parseUnits("9800", 18));
  });

  it("User can repay their loan", async function () {
    // Approve cCTC tokens for contract
    const amount = ethers.parseUnits("200", 18);
    await cCTC.connect(user1).approve(await loanContract.getAddress(), amount);

    // Get user's active loan id
    const loans = await loanContract.getUserLoans(user1.address);
    const loanId = loans[0];

    await loanContract.connect(user1).repayLoan(loanId);

    const poolBal = await loanContract.getAvailablePool();
    expect(poolBal).to.equal(ethers.parseUnits("10000", 18));

    const userWBal = await cCTC.balanceOf(user1.address);
    expect(userWBal).to.equal(0);
  });

  it("Admin can withdraw unused tokens", async function () {
    const withdrawAmount = ethers.parseUnits("1000", 18);
    await loanContract.connect(admin).adminWithdraw(withdrawAmount);

    const poolBal = await loanContract.getAvailablePool();
    expect(poolBal).to.equal(ethers.parseUnits("9000", 18));
  });
});
