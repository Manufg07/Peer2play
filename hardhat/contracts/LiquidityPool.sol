// contracts/LiquidityPool.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public totalLiquidityA;
    uint256 public totalLiquidityB;

    mapping(address => uint256) public liquidityA;
    mapping(address => uint256) public liquidityB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) public {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        totalLiquidityA += amountA;
        totalLiquidityB += amountB;

        liquidityA[msg.sender] += amountA;
        liquidityB[msg.sender] += amountB;
    }

    function removeLiquidity(uint256 amountA, uint256 amountB) public {
        require(
            liquidityA[msg.sender] >= amountA && liquidityB[msg.sender] >= amountB,
            "Insufficient liquidity"
        );

        liquidityA[msg.sender] -= amountA;
        liquidityB[msg.sender] -= amountB;

        totalLiquidityA -= amountA;
        totalLiquidityB -= amountB;

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }

    function swap(address fromToken, address toToken, uint256 amount) public {
        require(
            (fromToken == address(tokenA) && toToken == address(tokenB)) ||
            (fromToken == address(tokenB) && toToken == address(tokenA)),
            "Invalid token pair"
        );

        IERC20 from = IERC20(fromToken);
        IERC20 to = IERC20(toToken);

        uint256 swapRate = fromToken == address(tokenA) ? totalLiquidityB / totalLiquidityA : totalLiquidityA / totalLiquidityB;
        uint256 toAmount = amount * swapRate;

        require(from.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(to.balanceOf(address(this)) >= toAmount, "Insufficient pool liquidity");

        from.transferFrom(msg.sender, address(this), amount);
        to.transfer(msg.sender, toAmount);
    }
}
