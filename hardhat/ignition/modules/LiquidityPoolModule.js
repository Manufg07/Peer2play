const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LiquidityPoolModule", (m) => {
  const tokenA = m.contract("TokenA");
  const tokenB = m.contract("TokenB");
  const liquidityPool = m.contract("LiquidityPool", [tokenA, tokenB]);

  return { tokenA, tokenB, liquidityPool };
});
