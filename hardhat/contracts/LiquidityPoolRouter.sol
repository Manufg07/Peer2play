// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidityPoolFactory.sol";

contract LiquidityPoolRouter {
    LiquidityPoolFactory public factory;

    constructor(address _factory) {
        factory = LiquidityPoolFactory(_factory);
    }

    function swapExactTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        address pool = factory.getPool(tokenIn, tokenOut);
        require(pool != address(0), "Pool does not exist");
        IERC20(tokenIn).transferFrom(msg.sender, pool, amountIn);
        amountOut = LiquidityPool(pool).swap(amountIn, tokenIn == address(LiquidityPool(pool).token1()));

        IERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}
