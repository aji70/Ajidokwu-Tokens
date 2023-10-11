const {
    time,
    loadFixture,
  } = require( "@nomicfoundation/hardhat-toolbox/network-helpers");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");
const { Form } = require("react-bootstrap");


  describe("My token contract test", function(){
    async function deployMyTokenContract(){
        const MyTokenContract = await ethers.getContractFactory("MyToken");
        const myToken = await MyTokenContract.deploy();
    }

    it('Should transfer tokens from one address to another', async function () {
        const MyTokenContract = await ethers.getContractFactory("MyToken");
        const myToken = await MyTokenContract.deploy();
        // Get the contract owner's address
        const [owner, recipient] = await ethers.getSigners();
    
        // Transfer tokens from the owner to the recipient
        const amountToTransfer = 100; // Adjust the amount as needed
        const initialOwnerBalance = await myToken.balanceOf(Form.address);
        const initialRecipientBalance = await myToken.balanceOf(to.address);
    
        await myToken.transfer(from.address, amountToTransfer);
    
        const finalOwnerBalance = await myToken.balanceOf(from.address);
        const finalRecipientBalance = await myToken.balanceOf(to.address);
    
        // Check if the balances were updated correctly
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - amountToTransfer);
        expect(finalRecipientBalance).to.equal(initialRecipientBalance + amountToTransfer);
      });
  })

  
