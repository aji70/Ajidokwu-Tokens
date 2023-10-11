const {
  time,
  loadFixture,
} = require( "@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken Contract", function () {
  let MyToken;
  let myToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(1000000); // Initial supply of 1,000,000 tokens
    myToken = await MyToken.deploy({ gasLimit: 2000000 });
    await myToken.deployed();
  });

  it("Should return the correct name, symbol, and decimals", async function () {
    expect(await myToken.name()).to.equal("Ajidokwu");
    expect(await myToken.symbol()).to.equal("AJI");
    expect(await myToken.decimals()).to.equal(18);
  });

  it("Should transfer tokens between accounts", async function () {
    const initialBalanceOwner = await myToken.balanceOf(owner.address);
    const transferAmount = 1000;

    // Transfer tokens from owner to addr1
    await myToken.transfer(addr1.address, transferAmount);
    expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    expect(await myToken.balanceOf(owner.address)).to.equal(initialBalanceOwner - transferAmount);
  });

  it("Should approve and transferFrom tokens between accounts", async function () {
    const initialBalanceOwner = await myToken.balanceOf(owner.address);
    const transferAmount = 1000;

    // Approve addr1 to spend tokens from owner's account
    await myToken.approve(addr1.address, transferAmount);

    // Transfer tokens from owner to addr2 using addr1 as a proxy
    await myToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);

    expect(await myToken.balanceOf(addr2.address)).to.equal(transferAmount);
    expect(await myToken.balanceOf(owner.address)).to.equal(initialBalanceOwner - transferAmount);
  });

  it("Should mint tokens by the owner", async function () {
    const mintAmount = 1000;
    const initialTotalSupply = await myToken.totalSupply();

    // Mint new tokens
    await myToken.connect(owner).mint(addr1.address, mintAmount);

    expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
    expect(await myToken.totalSupply()).to.equal(initialTotalSupply + mintAmount);
  });

  it("Should burn tokens by the owner", async function () {
    const burnAmount = 500;
    const initialTotalSupply = await myToken.totalSupply();

    // Burn tokens
    await myToken.connect(owner).burn(burnAmount);

    expect(await myToken.balanceOf(owner.address)).to.equal(initialTotalSupply - burnAmount);
    expect(await myToken.totalSupply()).to.equal(initialTotalSupply - burnAmount);
  });
});
