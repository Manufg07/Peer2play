import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactoryABI from "../abis/LiquidityPoolFactory.json";
import LiquidityPoolABI from "../abis/LiquidityPool.json";

const ViewPools = ({ signer }) => {
  const [pools, setPools] = useState([]);
  const [selectedPoolDetails, setSelectedPoolDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const factoryAddress = "0xB240eFC0391c53E41Db1F6992B6a1Fbb0b98dFbd";

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const factoryContract = new ethers.Contract(
          factoryAddress,
          LiquidityPoolFactoryABI.abi,
          signer
        );

        const allPools = await factoryContract.getAllPools();
        setPools(allPools);
      } catch (error) {
        console.error("Error fetching pools:", error);
        alert("Error fetching pools.");
      }
    };

    fetchPools();
  }, [signer]);

  const fetchPoolDetails = async (poolAddress) => {
    try {
      const poolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );

      // Fetch reserves
      const [reserve1Raw, reserve2Raw] = await poolContract.getReserves();
      const reserve1 = ethers.formatEther(reserve1Raw);
      const reserve2 = ethers.formatEther(reserve2Raw);

      // Fetch LP token total supply
      const lpAddress = await poolContract.lpToken();
      const lpTokenContract = new ethers.Contract(
        lpAddress,
        ["function totalSupply() view returns (uint256)"],
        signer
      );
      const totalSupplyRaw = await lpTokenContract.totalSupply();
      const totalSupply = ethers.formatEther(totalSupplyRaw);

      // Set pool details
      setSelectedPoolDetails({
        poolAddress,
        reserve1,
        reserve2,
        totalSupply,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching pool details:", error.message || error);
      alert(
        "Error fetching pool details. Please ensure the pool contract is deployed and accessible."
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoolDetails(null);
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">All Liquidity Pools</h2>
      {pools.length > 0 ? (
        <ul className="list-disc list-inside">
          {pools.map((pool, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">Pool Address:</span> {pool}
              <button
                className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out"
                onClick={() => fetchPoolDetails(pool)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pools found.</p>
      )}

      {/* Modal for Pool Details */}
      {isModalOpen && selectedPoolDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              Details for Pool: {selectedPoolDetails.poolAddress}
            </h3>
            <p>
              <strong>🔵 Token A Reserve:</strong>{" "}
              {selectedPoolDetails.reserve1}
            </p>
            <p>
              <strong>🟢 Token B Reserve:</strong>{" "}
              {selectedPoolDetails.reserve2}
            </p>
            <p>
              <strong>💰 Total LP Token Supply:</strong>{" "}
              {selectedPoolDetails.totalSupply}
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition duration-200 ease-in-out"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPools;
