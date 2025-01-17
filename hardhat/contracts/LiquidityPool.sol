// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidityPoolToken.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LiquidityPool is ReentrancyGuard {
    IERC20 public token1;
    IERC20 public token2;
    LiquidityPoolToken public lpToken;

    uint256 private constant MINIMUM_LIQUIDITY = 1000;

    constructor(address _token1, address _token2) {
        require(_token1 != _token2, "Tokens must be different");
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
        lpToken = new LiquidityPoolToken("Liquidity Pool Token", "LPT");
    }

    function addLiquidity(uint256 amount1, uint256 amount2) external nonReentrant {
        require(amount1 > 0 && amount2 > 0, "Amounts must be greater than 0");

        uint256 totalSupply = lpToken.totalSupply();
        uint256 shares;

        if (totalSupply == 0) {
            shares = (amount1 + amount2) / 2; // Initial LP minting
        } else {
            uint256 reserve1 = token1.balanceOf(address(this));
            uint256 reserve2 = token2.balanceOf(address(this));
            
            shares = totalSupply * ((amount1 + amount2) / (reserve1 + reserve2));
        }

        token1.transferFrom(msg.sender, address(this), amount1);
        token2.transferFrom(msg.sender, address(this), amount2);
        
        lpToken.mint(msg.sender, shares);
    }

    function removeLiquidity(uint256 shares) external nonReentrant {
        require(lpToken.balanceOf(msg.sender) >= shares, "Insufficient LP tokens");

        uint256 amount1 = (shares * token1.balanceOf(address(this))) / lpToken.totalSupply();
        uint256 amount2 = (shares * token2.balanceOf(address(this))) / lpToken.totalSupply();

        lpToken.burn(msg.sender, shares);

        token1.transfer(msg.sender, amount1);
        token2.transfer(msg.sender, amount2);
    }

    function swap(uint256 amountIn, bool token1ToToken2) external nonReentrant returns (uint256 amountOut) {
        (uint256 reserve1, uint256 reserve2) = (token1.balanceOf(address(this)), token2.balanceOf(address(this)));

        if (token1ToToken2) {
            require(token1.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
            uint256 amountInWithFee = (amountIn * 997) / 1000;
            amountOut = (amountInWithFee * reserve2) / (reserve1 + amountInWithFee);
            require(token2.transfer(msg.sender, amountOut), "Swap failed");
        } else {
            require(token2.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
            uint256 amountInWithFee = (amountIn * 997) / 1000;
            amountOut = (amountInWithFee * reserve1) / (reserve2 + amountInWithFee);
            require(token1.transfer(msg.sender, amountOut), "Swap failed");
        }
    }

    // New function to get the reserves
    function getReserves() external view returns (uint256 reserve1, uint256 reserve2) {
        reserve1 = token1.balanceOf(address(this));
        reserve2 = token2.balanceOf(address(this));
    }
}
