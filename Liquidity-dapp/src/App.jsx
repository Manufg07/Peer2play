import React, { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import CreatePool from "./components/CreatePool";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import SwapTokens from "./components/SwapTokens";
import ViewPools from "./components/ViewPools";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Liquidity Pool DApp
      </h1>

      <WalletConnect
        setProvider={setProvider}
        setSigner={setSigner}
        setAddress={setAddress}
      />

      {signer && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <CreatePool signer={signer} />
          <AddLiquidity signer={signer} address={address} />
          <RemoveLiquidity signer={signer} />
          <SwapTokens signer={signer} address={address} />
          <ViewPools signer={signer} />
        </div>
      )}
    </div>
  );
}

export default App;
