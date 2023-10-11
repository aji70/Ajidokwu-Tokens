const {expect} = require("chai"); // Mocha-framework, chai-library
const { ethers } = require("hardhat");

// basic syntax just to describe the contract name you can write any name over here.
describe("Token contract", function () {

	let Token;
	let hardhatToken;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	/* beforeEach is a hook provided by mocha blockchain to attach common
	part before every describe function.*/
	/* common block to define, declare, intialize every common requirement such as to deploy,
	create an instance of blockchain.*/
	beforeEach(async () => {
		// getSigners is used to get the account addresses and there balances.
		[owner,addr1,addr2,...addrs] = await ethers.getSigners(); 
		
		// Creating instance of the contract.
		// getContractFactory is used to create instance of the contract.
		Token = await ethers.getContractFactory("Token"); 
		
		// Deploying the above instance over hardhat platform provided test local blockchain.
		hardhatToken = await Token.deploy(); 
	});


	describe('Deployment', () => {
		// it - is used to perform test over every function.
		// For testing every function we define 'it'.
		// Below 'it' checks if the deployment is done perfectly over a constructor call. 
		it("Should set the right owner", async () => {
			expect(await hardhatToken.owner()).to.equal(owner.address);
		}).timeout(50000);

		it("Deployment should assign the total supply of tokens to the owner", async () => {

			/* Checking if the totalSupply is assigned to the owner and 
			owner's balance has been credited.*/
			// extracting balance assigned to owner after deployment.
			const ownerBalance = await hardhatToken.balanceOf(owner.address); 
		
			// Testing if( ownerBalance == totalSupply()) 
			/* if this doesn't happens to be true it will show 1 failing with 
			AssertionError: Expected "10000" to be equal 10 */
			expect(await hardhatToken.totalSupply()).to.equal(ownerBalance); 
			
		}).timeout(50000);
	});


	describe('Transaction', () => {
		it("Should transfer tokens between accounts",async () => {

			// Transfer 10 tokens from owner to addr1
		await hardhatToken.transfer(addr1.address,10);
		// extracting balance assigned to addr1 after deployment.
		const addr1Balance = await hardhatToken.balanceOf(addr1.address); 
		expect(addr1Balance).to.equal(10);
		
			// Transfer 5 tokens from addr2 to addr1
			await hardhatToken.connect(addr1).transfer(addr2.address,5);
			// extracting balance assigned to addr2 after deployment.
			const addr2Balance = await hardhatToken.balanceOf(addr2.address); 
			expect(addr2Balance).to.equal(5);

		}).timeout(50000);

		it("Should fail if sender doesnot have enough tokens",async () => {
			
		const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); 
		await expect(hardhatToken.connect(addr1).transfer(owner.address,1)).to.be.revertedWith("Not enough tokens");
		
		expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);

		}).timeout(50000);


		 it("Should update balances after transfers",async () => {

		 const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); 
		 await hardhatToken.transfer(addr1.address,5);
		 await hardhatToken.transfer(addr2.address,10);
		 const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
		 expect(finalOwnerBalance).to.equal(9985);
		 const addr1Balance = await hardhatToken.balanceOf(addr1.address);
		 expect(addr1Balance).to.equal(5);

		 const addr2Balance = await hardhatToken.balanceOf(addr2.address);
		
		 expect(addr2Balance).to.equal(10)
		 }).timeout(50000);
	});

    it("Should mint new tokens ",async () => {

        // Transfer 10 tokens from owner to addr1
    await hardhatToken.mint(owner,10);
    // extracting balance assigned to addr1 after deployment.
    const addr1Balance = await hardhatToken.balanceOf(owner); 
    expect(addr1Balance).to.equal(10010);
    
        // Transfer 5 tokens from addr2 to addr1
        await hardhatToken.connect(owner).mint(owner,5);
        // extracting balance assigned to addr2 after deployment.
        const addr2Balance = await hardhatToken.balanceOf(owner); 
        expect(addr2Balance).to.equal( (10015));

    }).timeout(50000);

    it("Should burn tokens",async () => {

        // Transfer 10 tokens from owner to addr1
    await hardhatToken.burn(100);
    // extracting balance assigned to addr1 after deployment.
    const addr1Balance = await hardhatToken.balanceOf(owner); 
    expect(addr1Balance).to.equal(9900);
    
        // Transfer 5 tokens from addr2 to addr1
        await hardhatToken.connect(owner).burn(50);
        // extracting balance assigned to addr2 after deployment.
        const addr2Balance = await hardhatToken.balanceOf(owner); 
        expect(addr2Balance).to.equal(9850);

    }).timeout(50000);


});
