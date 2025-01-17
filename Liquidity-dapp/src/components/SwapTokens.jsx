import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenABI from "../abis/TokenA.json";

const tokenAAddress = "0x2B6f4e4BA3dC2556394340312e35C48B2698B640";
const tokenBAddress = "0x55359EFffb19B2bC1593C9c049e3D1b6c98258FA";

const SwapTokens = ({ signer }) => {
  const [tokenAddress, setTokenAddress] = useState(tokenAAddress);
  const [tokenDetails, setTokenDetails] = useState({});
  const [userBalance, setUserBalance] = useState("0");

  useEffect(() => {
    if (signer) {
      fetchTokenDetails(tokenAddress);
    }
  }, [signer, tokenAddress]);

  const fetchTokenDetails = async (address) => {
    try {
      const tokenContract = new ethers.Contract(address, TokenABI.abi, signer);
      const [name, symbol, totalSupply, balance] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.balanceOf(await signer.getAddress()),
      ]);

      setTokenDetails({
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
      });
      setUserBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Token Details</h2>

      <select
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        className="block w-full mb-4 p-2 border rounded"
      >
        <option value={tokenAAddress}>Token A</option>
        <option value={tokenBAddress}>Token B</option>
      </select>

      {tokenDetails.name ? (
        <div>
          <p>
            <strong>Name:</strong> {tokenDetails.name}
          </p>
          <p>
            <strong>Symbol:</strong> {tokenDetails.symbol}
          </p>
          <p>
            <strong>Total Supply:</strong> {tokenDetails.totalSupply}{" "}
            {tokenDetails.symbol}
          </p>
          <p>
            <strong>Your Balance:</strong> {userBalance} {tokenDetails.symbol}
          </p>
        </div>
      ) : (
        <p>Loading token details...</p>
      )}
    </div>
  );
};

export default SwapTokens;
