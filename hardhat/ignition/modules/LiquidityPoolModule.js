const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LiquidityPoolModule", (m) => {
  const tokenA = m.contract("TokenA");
  const tokenB = m.contract("TokenB");
  const factory = m.contract("LiquidityPoolFactory");
  const router = m.contract("LiquidityPoolRouter", [factory]);

  m.call(factory, "createPool", [tokenA, tokenB]);

  return { tokenA, tokenB, factory, router };
});
