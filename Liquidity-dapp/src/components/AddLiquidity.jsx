import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolABI from "../abis/LiquidityPool.json";
import TokenAABI from "../abis/TokenA.json";
import TokenBABI from "../abis/TokenB.json";
import LPTokenABI from "../abis/LiquidityPoolToken.json"; // Ensure you have LP Token ABI

const AddLiquidity = ({ signer }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [reserves, setReserves] = useState({ tokenA: "0", tokenB: "0" });
  const [lpBalance, setLpBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const tokenAAddress = "0x2163A74F785943Fc5851F8D265f8Cc90542766E3";
  const tokenBAddress = "0x5b99d19f051B0f80b4F37f6119F5Cb880f1293Fd";

  // Fetch pool reserves & LP balance
  const fetchPoolData = async () => {
    try {
      if (!poolAddress || !ethers.isAddress(poolAddress) || !signer) {
        console.error("Invalid pool address or signer.");
        return;
      }

      setLoading(true);

      const liquidityPoolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );

      // Fetch reserves from the liquidity pool contract
      const [reserveA, reserveB] = await liquidityPoolContract.getReserves();
      setReserves({
        tokenA: ethers.formatEther(reserveA),
        tokenB: ethers.formatEther(reserveB),
      });

      // Fetch LP token balance
      const userAddress = await signer.getAddress();
      const lpTokenAddress = await liquidityPoolContract.lpToken();
      const lpTokenContract = new ethers.Contract(
        lpTokenAddress,
        LPTokenABI.abi,
        signer
      );

      const lpTokenBalance = await lpTokenContract.balanceOf(userAddress);
      setLpBalance(ethers.formatEther(lpTokenBalance));

      console.log("Updated Pool Reserves:", {
        tokenA: ethers.formatEther(reserveA),
        tokenB: ethers.formatEther(reserveB),
        lpTokens: ethers.formatEther(lpTokenBalance),
      });
    } catch (error) {
      console.error("Error fetching pool data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when poolAddress or signer changes
  useEffect(() => {
    if (signer && poolAddress) {
      fetchPoolData();
    }
  }, [signer, poolAddress]);

  // Function to add liquidity
  const addLiquidity = async () => {
    try {
      if (!poolAddress || !signer)
        return alert("Please enter a valid pool address!");

      const tokenAContract = new ethers.Contract(
        tokenAAddress,
        TokenAABI.abi,
        signer
      );
      const tokenBContract = new ethers.Contract(
        tokenBAddress,
        TokenBABI.abi,
        signer
      );
      const liquidityPoolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );

      console.log("Approving Token A...");
      const txA = await tokenAContract.approve(
        poolAddress,
        ethers.parseEther(amountA)
      );
      await txA.wait();
      console.log("Token A approved!");

      console.log("Approving Token B...");
      const txB = await tokenBContract.approve(
        poolAddress,
        ethers.parseEther(amountB)
      );
      await txB.wait();
      console.log("Token B approved!");

      console.log("Adding liquidity...");
      const txLiquidity = await liquidityPoolContract.addLiquidity(
        ethers.parseEther(amountA),
        ethers.parseEther(amountB)
      );
      await txLiquidity.wait();

      alert("Liquidity added successfully!");
      await fetchPoolData(); // Refresh pool details after adding liquidity
    } catch (error) {
      console.error(error);
      alert("Error adding liquidity.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Add Liquidity</h2>

      <input
        type="text"
        placeholder="Pool Address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />

      <input
        type="text"
        placeholder="Amount of Token A"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />

      <input
        type="text"
        placeholder="Amount of Token B"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />

      <button
        onClick={addLiquidity}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Liquidity
      </button>

      {/* Display Pool Reserves & LP Balance */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-md font-semibold">Liquidity Pool Details</h3>
        {loading ? (
          <p>Loading pool data...</p>
        ) : (
          <>
            <p>🔵 Token A Reserve: {reserves.tokenA}</p>
            <p>🟢 Token B Reserve: {reserves.tokenB}</p>
            <p>💰 Your LP Tokens: {lpBalance}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AddLiquidity;
