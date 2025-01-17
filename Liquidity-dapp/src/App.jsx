import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreatePool from "./components/CreatePool";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import SwapTokens from "./components/SwapTokens";
import ViewPools from "./components/ViewPools";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedPoolAddress, setSelectedPoolAddress] = useState("");

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await browserProvider.getSigner();
        const userAddress = await ethSigner.getAddress();

        setProvider(browserProvider);
        setSigner(ethSigner);
        setAddress(userAddress);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this DApp!");
    }
  };

  // Automatically connect wallet if already authorized
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const ethSigner = await browserProvider.getSigner();
            const userAddress = accounts[0];

            setProvider(browserProvider);
            setSigner(ethSigner);
            setAddress(userAddress);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Navbar */}
      <nav className="bg-teal-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Liquidity Pool DApp</h1>
          <div>
            {address ? (
              <p className="text-sm">
                Connected:{" "}
                <span className="font-mono bg-teal-700 text-teal-100 px-2 py-1 rounded">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </p>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-extrabold text-center text-teal-800 mb-8">
          Manage Your Liquidity Pools with Ease
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Connect your wallet to access advanced features like creating pools,
          swapping tokens, and managing liquidity.
        </p>

        {signer ? (
          <div className="space-y-12">
            <FeatureSection
              title="Create a Pool"
              description="Easily create new liquidity pools and manage your assets."
              component={<CreatePool signer={signer} />}
              color="bg-teal-100"
            />
            <FeatureSection
              title="Add Liquidity"
              description="Add liquidity to your pools and earn rewards."
              component={<AddLiquidity signer={signer} address={address} />}
              color="bg-gray-100"
            />
            <FeatureSection
              title="Remove Liquidity"
              description="Withdraw your assets from liquidity pools at any time."
              component={<RemoveLiquidity signer={signer} />}
              color="bg-teal-100"
            />
            <FeatureSection
              title="Token Details"
              description="Exchange tokens quickly and securely using our swap feature."
              component={
                <SwapTokens
                  signer={signer}
                  selectedPoolAddress={selectedPoolAddress}
                />
              }
              color="bg-gray-100"
            />
            <FeatureSection
              title="View Pools"
              description="Monitor the performance of all liquidity pools."
              component={
                <ViewPools
                  signer={signer}
                  setSelectedPoolAddress={setSelectedPoolAddress}
                />
              }
              color="bg-teal-100"
            />
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            <p className="text-lg">
              Please connect your wallet to access features.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Liquidity Pool DApp. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Section Component
const FeatureSection = ({ title, description, component, color }) => (
  <section
    className={`${color} rounded-lg shadow-md p-8 transition-transform transform hover:scale-105`}
  >
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-teal-800">{title}</h3>
      <p className="text-gray-700 mt-2">{description}</p>
    </div>
    <div>{component}</div>
  </section>
);

export default App;
