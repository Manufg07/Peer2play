import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolABI from "../abis/LiquidityPool.json";
import TokenAABI from "../abis/TokenA.json";
import TokenBABI from "../abis/TokenB.json";

const SwapTokens = ({ signer, address }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isToken1ToToken2, setIsToken1ToToken2] = useState(true);
  const [tokenABalance, setTokenABalance] = useState("0");
  const [tokenBBalance, setTokenBBalance] = useState("0");
  const [swapHistory, setSwapHistory] = useState([]);

  const tokenAAddress = "0x2163A74F785943Fc5851F8D265f8Cc90542766E3";
  const tokenBAddress = "0x5b99d19f051B0f80b4F37f6119F5Cb880f1293Fd";

  // Fetch token balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
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

        const balanceA = await tokenAContract.balanceOf(address);
        const balanceB = await tokenBContract.balanceOf(address);

        setTokenABalance(ethers.formatEther(balanceA));
        setTokenBBalance(ethers.formatEther(balanceB));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    if (signer && address) {
      fetchBalances();
    }
  }, [signer, address]);

  const swapTokens = async () => {
    try {
      // Determine which token is being swapped
      const tokenAddress = isToken1ToToken2 ? tokenAAddress : tokenBAddress;
      const tokenABI = isToken1ToToken2 ? TokenAABI : TokenBABI;

      // Get the token contract
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI.abi,
        signer
      );

      // Approve the pool to spend tokens
      const approveTx = await tokenContract.approve(
        poolAddress,
        ethers.parseEther(amount)
      );
      await approveTx.wait();
      console.log(`Approved ${amount} tokens for pool: ${poolAddress}`);

      // Get the LiquidityPool contract
      const liquidityPoolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );

      // Perform the swap
      const swapTx = await liquidityPoolContract.swap(
        ethers.parseEther(amount),
        isToken1ToToken2
      );
      const receipt = await swapTx.wait();

      // Fetch updated balances
      const newBalanceA = await tokenContract.balanceOf(address);
      const newBalanceB = await new ethers.Contract(
        isToken1ToToken2 ? tokenBAddress : tokenAAddress,
        isToken1ToToken2 ? TokenBABI.abi : TokenAABI.abi,
        signer
      ).balanceOf(address);

      setTokenABalance(ethers.formatEther(newBalanceA));
      setTokenBBalance(ethers.formatEther(newBalanceB));

      // Add transaction to swap history
      setSwapHistory([
        ...swapHistory,
        {
          txHash: receipt.transactionHash,
          swapped: `${amount} ${isToken1ToToken2 ? "TokenA" : "TokenB"}`,
          received: `${ethers.formatEther(receipt.logs[0]?.args[1] || "0")} ${
            isToken1ToToken2 ? "TokenB" : "TokenA"
          }`,
        },
      ]);

      alert("Swap successful!");
    } catch (error) {
      console.error(error);
      alert("Error swapping tokens. See console for details.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Swap Tokens</h2>

      {/* Balances */}
      <div className="mb-4">
        <p>
          <span className="font-bold">TokenA Balance:</span> {tokenABalance}
        </p>
        <p>
          <span className="font-bold">TokenB Balance:</span> {tokenBBalance}
        </p>
      </div>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Pool Address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      />
      <select
        value={isToken1ToToken2}
        onChange={(e) => setIsToken1ToToken2(e.target.value === "true")}
        className="block w-full mb-4 p-2 border rounded"
      >
        <option value="true">TokenA → TokenB</option>
        <option value="false">TokenB → TokenA</option>
      </select>
      <button
        onClick={swapTokens}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Swap Tokens
      </button>

      {/* Swap History */}
      <h3 className="text-lg font-semibold mt-6">Swap History</h3>
      <ul className="list-disc list-inside">
        {swapHistory.map((swap, index) => (
          <li key={index} className="mb-2">
            <p>
              <span className="font-bold">Transaction Hash:</span> {swap.txHash}
            </p>
            <p>
              <span className="font-bold">Swapped:</span> {swap.swapped}
            </p>
            <p>
              <span className="font-bold">Received:</span> {swap.received}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SwapTokens;
