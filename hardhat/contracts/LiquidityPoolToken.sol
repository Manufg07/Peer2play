// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPoolToken is ERC20 {
    address public liquidityPool;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        liquidityPool = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == liquidityPool, "Only pool can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == liquidityPool, "Only pool can burn");
        _burn(from, amount);
    }
}
