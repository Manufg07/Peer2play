import React, { useState } from "react";
import { ethers } from "ethers";
import LiquidityPoolABI from "../abis/LiquidityPool.json";

const RemoveLiquidity = ({ signer }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [shares, setShares] = useState("");

  const removeLiquidity = async () => {
    try {
      const liquidityPoolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );

      // Remove liquidity
      const tx = await liquidityPoolContract.removeLiquidity(
        ethers.parseEther(shares)
      );
      await tx.wait();

      alert("Liquidity removed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error removing liquidity.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Remove Liquidity</h2>
      <input
        type="text"
        placeholder="Pool Address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Shares to Remove"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={removeLiquidity}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Remove Liquidity
      </button>
    </div>
  );
};

export default RemoveLiquidity;
