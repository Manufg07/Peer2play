import React from "react";
import { ethers } from "ethers";

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setSigner(signer);
      setAddress(address);
    } else {
      alert("Please install MetaMask to use this DApp!");
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
};

export default WalletConnect;
