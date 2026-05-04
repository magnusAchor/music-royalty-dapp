import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0b10] text-white flex">

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold">🎵 RoyaltyOS</h1>
          <p className="text-xs text-gray-400 mt-1">
            Web3 Music Revenue System
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm text-gray-300 mt-6">
          <Link className="hover:text-white" to="/">Dashboard</Link>
          <Link className="hover:text-white" to="/create">Create Song</Link>
        </nav>

        <div className="mt-auto text-xs text-gray-500">
          v1.0 beta
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}