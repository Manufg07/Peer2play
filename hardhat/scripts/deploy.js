const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const outputPath = path.join(__dirname, "../deployedContracts.json");

  // Step 1: Deploy TokenA
  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);

  // Step 2: Deploy TokenB
  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log("TokenB deployed to:", tokenB.address);

  // Step 3: Deploy LiquidityPoolFactory
  const LiquidityPoolFactory = await ethers.getContractFactory(
    "LiquidityPoolFactory"
  );
  const factory = await LiquidityPoolFactory.deploy();
  await factory.deployed();
  console.log("LiquidityPoolFactory deployed to:", factory.address);

  // Step 4: Deploy LiquidityPoolRouter
  const LiquidityPoolRouter = await ethers.getContractFactory(
    "LiquidityPoolRouter"
  );
  const router = await LiquidityPoolRouter.deploy(factory.address);
  await router.deployed();
  console.log("LiquidityPoolRouter deployed to:", router.address);

  // Step 5: Create a liquidity pool for TokenA and TokenB
  const tx = await factory.createPool(tokenA.address, tokenB.address);
  await tx.wait();
  console.log(
    `Liquidity Pool created for TokenA (${tokenA.address}) and TokenB (${tokenB.address})`
  );

  // Save deployed contract addresses and ABIs
  const deploymentData = {
    TokenA: {
      address: tokenA.address,
      abi: require(`../artifacts/contracts/TokenA.sol/TokenA.json`).abi,
    },
    TokenB: {
      address: tokenB.address,
      abi: require(`../artifacts/contracts/TokenB.sol/TokenB.json`).abi,
    },
    LiquidityPoolFactory: {
      address: factory.address,
      abi: require(`../artifacts/contracts/LiquidityPoolFactory.sol/LiquidityPoolFactory.json`)
        .abi,
    },
    LiquidityPoolRouter: {
      address: router.address,
      abi: require(`../artifacts/contracts/LiquidityPoolRouter.sol/LiquidityPoolRouter.json`)
        .abi,
    },
  };

  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("Deployment data saved to:", outputPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
