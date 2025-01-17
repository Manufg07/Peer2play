import React, { useState } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactoryABI from "../abis/LiquidityPoolFactory.json";

const CreatePool = ({ signer }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const factoryAddress = "0xBD2835B887a177232B6565cc9D16eFB7e153Da8c";

  const createPool = async () => {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!ethers.isAddress(tokenA) || !ethers.isAddress(tokenB)) {
      alert(
        "Invalid token address. Please enter valid ERC-20 token addresses."
      );
      return;
    }

    if (tokenA.toLowerCase() === tokenB.toLowerCase()) {
      alert("Token A and Token B must be different!");
      return;
    }

    try {
      setLoading(true);
      const factoryContract = new ethers.Contract(
        factoryAddress,
        LiquidityPoolFactoryABI.abi,
        signer
      );

      console.log("Creating pool...");
      const tx = await factoryContract.createPool(tokenA, tokenB);
      await tx.wait();
      console.log("Liquidity pool created successfully!");

      alert("Liquidity pool created successfully!");
      setTokenA("");
      setTokenB("");
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Failed to create liquidity pool. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Create Liquidity Pool</h2>
      <input
        type="text"
        placeholder="Token A Address"
        value={tokenA}
        onChange={(e) => setTokenA(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Token B Address"
        value={tokenB}
        onChange={(e) => setTokenB(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />
      <button
        onClick={createPool}
        disabled={loading}
        className={`px-4 py-2 text-white rounded ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Creating Pool..." : "Create Pool"}
      </button>
    </div>
  );
};

export default CreatePool;
