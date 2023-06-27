const { expect} = require("chai");
const hre = require('hardhat');

describe("TaCoin contract", function(){
    //global vars
    let Token;
    let TaCoin;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 122540000000;
    let tokenBlockReward = 25;

    beforeEach(async function () {
        //get the contractFactory and Signer here.
        Token = await ethers.getContractFactory("TaCoin");
        [owner, addr1, addr2,] = await hre.ethers.getSigners();

        TaCoin = await Token.deploy(tokenCap, tokenBlockReward);
    });

    describe("Deployment", function() {
        it("Should set the right owner", async function (){
            expect(await TaCoin.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of token to the owner", async function (){
            const ownerBalance = await TaCoin.balanceOf(owner.address);
            expect(await TaCoin.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function (){
            const cap = await TaCoin.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
        });

        it ("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await TaCoin.blockReward();
            expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
        });
        
        it("Should if sender doesn't have enough token", async function (){
            const initialOwnerBalance = await TaCoin.balanceOf(owner.address);
            // try send 1 token from addr1 (0 token) t owner (7000000)
            // 'require' will evaluate false and revert the transaction 
            await expect(
                TaCoin.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ER20: Transfer exceeds balance");

            //Owner balance shouldn't have changed.
            expect(await TaCoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it ("Should update balance after transfers", async function () {
            const initialOwnerBalance = await TaCoin.balanceOf(owner.address);

            //Transfer 20000 token from owner to addr1
            await TaCoin.transfer(addr1.address, 20000);

            //Transfer another 500000 token from owner to addr2
            await TaCoin.transfer(addr2.address, 500000);

            //Check balances
            const finalOwnerBalance = await TaCoin.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(520000));

            const addr1Balance = await TaCoin.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(20000);

            const addr2Balance = await TaCoin.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(500000);
            
        });

    });

});