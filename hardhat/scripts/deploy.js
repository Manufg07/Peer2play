const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TokenA
  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployTransaction.wait();
  console.log("TokenA deployed to:", tokenA.address);

  // Deploy TokenB
  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.deployTransaction.wait();
  console.log("TokenB deployed to:", tokenB.address);

  // Deploy LiquidityPool
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(
    tokenA.address,
    tokenB.address
  );
  await liquidityPool.deployTransaction.wait();
  console.log("LiquidityPool deployed to:", liquidityPool.address);

  // Save contract details to a JSON file
  const contractsData = {
    TokenA: {
      address: tokenA.address,
      abi: JSON.parse(tokenA.interface.format("json")),
    },
    TokenB: {
      address: tokenB.address,
      abi: JSON.parse(tokenB.interface.format("json")),
    },
    LiquidityPool: {
      address: liquidityPool.address,
      abi: JSON.parse(liquidityPool.interface.format("json")),
    },
  };

  fs.writeFileSync(
    "./deployedContracts.json",
    JSON.stringify(contractsData, null, 2)
  );

  console.log("Contract details saved to deployedContracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
