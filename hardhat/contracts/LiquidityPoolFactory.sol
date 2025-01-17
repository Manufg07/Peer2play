// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./LiquidityPool.sol";

contract LiquidityPoolFactory {
    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    event PoolCreated(address indexed tokenA, address indexed tokenB, address pool);

    function createPool(address tokenA, address tokenB) external returns (address pool) {
        require(tokenA != tokenB, "Tokens must be different");
        require(getPool[tokenA][tokenB] == address(0), "Pool already exists");

        pool = address(new LiquidityPool(tokenA, tokenB));
        getPool[tokenA][tokenB] = pool;
        getPool[tokenB][tokenA] = pool;
        allPools.push(pool);

        emit PoolCreated(tokenA, tokenB, pool);
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
}
