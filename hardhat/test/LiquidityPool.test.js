const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Liquidity Pool System", function () {
  let tokenA, tokenB, factory, router, poolAddress, liquidityPool;
  let owner, user1, user2;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners(); // Fetch signers

    // Deploy TokenA
    const TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy();
    await tokenA.deployed();
    console.log("TokenA deployed at:", tokenA.address);

    // Deploy TokenB
    const TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy();
    await tokenB.deployed();
    console.log("TokenB deployed at:", tokenB.address);

    // Deploy LiquidityPoolFactory
    const LiquidityPoolFactory = await ethers.getContractFactory(
      "LiquidityPoolFactory"
    );
    factory = await LiquidityPoolFactory.deploy();
    await factory.deployed();
    console.log("Factory deployed at:", factory.address);

    // Deploy LiquidityPoolRouter
    const LiquidityPoolRouter = await ethers.getContractFactory(
      "LiquidityPoolRouter"
    );
    router = await LiquidityPoolRouter.deploy(factory.address);
    await router.deployed();
    console.log("Router deployed at:", router.address);

    // Create a liquidity pool for TokenA and TokenB
    await factory.createPool(tokenA.address, tokenB.address);
    poolAddress = await factory.getPool(tokenA.address, tokenB.address);
    console.log("Liquidity Pool deployed at:", poolAddress);

    // Attach to the LiquidityPool contract
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = LiquidityPool.attach(poolAddress);

    // Approve tokens for adding liquidity
    await tokenA
      .connect(owner)
      .approve(poolAddress, ethers.utils.parseEther("1000"));
    await tokenB
      .connect(owner)
      .approve(poolAddress, ethers.utils.parseEther("1000"));
  });

  it("Should deploy TokenA and TokenB successfully", async function () {
    expect(tokenA.address).to.properAddress;
    expect(tokenB.address).to.properAddress;
  });

  it("Should deploy LiquidityPoolFactory successfully", async function () {
    expect(factory.address).to.properAddress;
  });

  it("Should deploy LiquidityPoolRouter successfully", async function () {
    expect(router.address).to.properAddress;
  });

  it("Should create a liquidity pool", async function () {
    expect(poolAddress).to.properAddress;
    expect(poolAddress).to.not.equal(ethers.constants.AddressZero);
  });

  it("Should add liquidity to the pool", async function () {
    // Add liquidity
    await liquidityPool
      .connect(owner)
      .addLiquidity(
        ethers.utils.parseEther("500"),
        ethers.utils.parseEther("500")
      );

    // Verify balances in the pool
    const poolTokenABalance = await tokenA.balanceOf(poolAddress);
    const poolTokenBBalance = await tokenB.balanceOf(poolAddress);

    expect(poolTokenABalance).to.equal(ethers.utils.parseEther("500"));
    expect(poolTokenBBalance).to.equal(ethers.utils.parseEther("500"));
  });

  it("Should allow token swapping", async function () {
    // Add liquidity first
    await liquidityPool
      .connect(owner)
      .addLiquidity(
        ethers.utils.parseEther("500"),
        ethers.utils.parseEther("500")
      );

    // Transfer TokenA to user1 so they can perform the swap
    await tokenA
      .connect(owner)
      .transfer(user1.address, ethers.utils.parseEther("200"));

    // Approve token for swapping
    await tokenA
      .connect(user1)
      .approve(poolAddress, ethers.utils.parseEther("100"));

    // Perform a swap (TokenA -> TokenB)
    const userBalanceBefore = await tokenB.balanceOf(user1.address);
    await liquidityPool
      .connect(user1)
      .swap(ethers.utils.parseEther("100"), true);
    const userBalanceAfter = await tokenB.balanceOf(user1.address);

    // Ensure user1 received TokenB
    expect(userBalanceAfter).to.be.gt(userBalanceBefore); // Verify swap success
  });

});
