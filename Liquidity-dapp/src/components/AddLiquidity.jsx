import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolABI from "../abis/LiquidityPool.json";
import TokenAABI from "../abis/TokenA.json";
import TokenBABI from "../abis/TokenB.json";
import LPTokenABI from "../abis/LiquidityPoolToken.json"; // LP Token ABI

const LiquidityPool = ({ signer }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState(true); // true = TokenA → TokenB
  const [reserves, setReserves] = useState({ tokenA: "0", tokenB: "0" });
  const [lpBalance, setLpBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [swapHistory, setSwapHistory] = useState([]); // Added state for swap history
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const tokenAAddress = "0x903e8025d61Cc5E6F7bBD3bB8E841d025E18CD91";
  const tokenBAddress = "0xd859f69c72db8fb25059C2F7679d99660ef592e7";

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

      console.log("Approving Token B...");
      const txB = await tokenBContract.approve(
        poolAddress,
        ethers.parseEther(amountB)
      );
      await txB.wait();

      console.log("Adding liquidity...");
      const txLiquidity = await liquidityPoolContract.addLiquidity(
        ethers.parseEther(amountA),
        ethers.parseEther(amountB)
      );
      await txLiquidity.wait();

      alert("Liquidity added successfully!");
      await fetchPoolData();
    } catch (error) {
      console.error(error);
      alert("Error adding liquidity.");
    }
  };

  // Function to swap tokens
const swapTokens = async () => {
  try {
    if (!poolAddress || !signer)
      return alert("Please enter a valid pool address!");

    const liquidityPoolContract = new ethers.Contract(
      poolAddress,
      LiquidityPoolABI.abi,
      signer
    );

    const tokenContract = new ethers.Contract(
      swapDirection ? tokenAAddress : tokenBAddress,
      swapDirection ? TokenAABI.abi : TokenBABI.abi,
      signer
    );

    // Check the current allowance before approving
    const userAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(
      userAddress,
      poolAddress
    );

    const swapAmountInWei = ethers.parseEther(swapAmount);

    // Use direct comparison instead of .lt()
    if (currentAllowance < swapAmountInWei) {
      console.log("Approving token for swap...");

      const approveTx = await tokenContract.approve(
        poolAddress,
        swapAmountInWei
      );
      await approveTx.wait();
    } else {
      console.log("Sufficient allowance already set.");
    }

    console.log("Swapping tokens...");
    const swapTx = await liquidityPoolContract.swap(
      swapAmountInWei,
      swapDirection
    );
    await swapTx.wait();

    alert("Swap successful!");
  } catch (error) {
    console.error(error);
    alert("Error swapping tokens.");
  }
};


  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Liquidity Pool</h2>

      {/* Pool Address Input */}
      <input
        type="text"
        placeholder="Pool Address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />

      {/* Add Liquidity Section */}
      <h3 className="text-lg font-semibold mb-2">Add Liquidity</h3>
      <input
        type="text"
        placeholder="Amount of Token A"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Amount of Token B"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <button
        onClick={addLiquidity}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full mb-4"
      >
        Add Liquidity
      </button>

      {/* Swap Section */}
      <h3 className="text-lg font-semibold mb-2">Swap Tokens</h3>
      <input
        type="text"
        placeholder="Amount to Swap"
        value={swapAmount}
        onChange={(e) => setSwapAmount(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <button
        onClick={() => setSwapDirection(!swapDirection)}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Swap Direction:{" "}
        {swapDirection ? "Token A → Token B" : "Token B → Token A"}
      </button>
      <button
        onClick={swapTokens}
        className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Swap Tokens
      </button>

      {/* Pool Details */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-md font-semibold">Pool Reserves & LP Balance</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>🔵 Token A: {reserves.tokenA}</p>
            <p>🟢 Token B: {reserves.tokenB}</p>
            <p>💰 Your LP Tokens: {lpBalance}</p>
          </>
        )}
      </div>

      {/* Swap History Modal */}
      <div>
        <button
          onClick={toggleModal}
          className="w-full mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          View Swap History
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h3 className="text-xl font-semibold mb-4">Swap History</h3>
              <ul>
                {swapHistory.length === 0 ? (
                  <li>No swaps yet.</li>
                ) : (
                  swapHistory.map((history, index) => (
                    <li key={index} className="mb-2">
                      <p>
                        <strong>Address:</strong> {history.userAddress}
                      </p>
                      <p>
                        <strong>Base Amount:</strong> {history.baseAmount}
                      </p>
                      <p>
                        <strong>Swapped Amount:</strong> {history.swappedAmount}
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {history.timestamp}
                      </p>
                      <hr />
                    </li>
                  ))
                )}
              </ul>
              <button
                onClick={toggleModal}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidityPool;
