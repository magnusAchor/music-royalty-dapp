import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

const abi = [
  "function songTitle() view returns (string)",
  "function releasable(address) view returns (uint256)",
  "function release(address)",
];

export default function Song() {
  const { address } = useParams();

  const [title, setTitle] = useState("");
  const [earnings, setEarnings] = useState("0");
  const [loading, setLoading] = useState(true);

  async function loadSong() {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(address, abi, signer);

    const songTitle = await contract.songTitle();
    const earned = await contract.releasable(await signer.getAddress());

    setTitle(songTitle);
    setEarnings(ethers.formatEther(earned));

    setLoading(false);
  }

  async function withdraw() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(address, abi, signer);

    const tx = await contract.release(await signer.getAddress());
    await tx.wait();

    alert("💰 Withdraw successful!");
    loadSong();
  }

  useEffect(() => {
    loadSong();
  }, []);

  if (loading) return <p className="p-10">Loading song...</p>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">🎵 {title}</h1>

      <div className="mt-6 bg-gray-900 p-6 rounded-xl">
        <p className="text-gray-400">Contract</p>
        <p className="break-all">{address}</p>
      </div>

      <div className="mt-6 bg-gray-900 p-6 rounded-xl">
        <p className="text-gray-400">Your Earnings</p>
        <p className="text-2xl font-bold text-green-400">
          {earnings} ETH
        </p>
      </div>

      <button
        onClick={withdraw}
        className="mt-6 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
      >
        💸 Withdraw Earnings
      </button>
    </div>
  );
}