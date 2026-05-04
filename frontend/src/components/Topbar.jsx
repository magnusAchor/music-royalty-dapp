import { useState } from "react";
import { ethers } from "ethers";

export default function Topbar() {
  const [wallet, setWallet] = useState(null);

  async function connect() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setWallet(await signer.getAddress());
  }

  return (
    <div className="flex justify-between p-4 border-b border-white/10">
      <div>🎧 Music Dashboard</div>

      <button onClick={connect} className="bg-purple-600 px-3 py-1 rounded">
        {wallet ? wallet.slice(0, 6) + "..." : "Connect Wallet"}
      </button>
    </div>
  );
}