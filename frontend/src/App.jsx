import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateSong from "./pages/CreateSong";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [connecting, setConnecting] = useState(false);

  async function connect() {
    try {
      if (!window.ethereum) { alert("Install MetaMask"); return; }
      setConnecting(true);
      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const address = await _signer.getAddress();
      setProvider(_provider); setSigner(_signer); setWallet(address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }

  useEffect(() => {
    async function checkConnection() {
      try {
        if (!window.ethereum) return;
        const _provider = new BrowserProvider(window.ethereum);
        const accounts = await _provider.send("eth_accounts", []);
        if (accounts?.length > 0) {
          const _signer = await _provider.getSigner();
          const address = await _signer.getAddress();
          setProvider(_provider); setSigner(_signer); setWallet(address);
        }
      } catch (err) { console.error(err); }
    }
    checkConnection();
  }, []);

  if (!wallet) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --gold: #C9A84C;
            --gold-light: #E8C97A;
            --gold-dim: #8A6A28;
            --bg: #080808;
            --surface: #111111;
            --border: rgba(201,168,76,0.15);
            --text: #F0EDE6;
            --muted: #6B6560;
          }
          body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

          .landing {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .landing-bg {
            position: absolute; inset: 0;
            background:
              radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 10% 80%, rgba(201,168,76,0.04) 0%, transparent 50%),
              #080808;
          }

          .noise {
            position: absolute; inset: 0; opacity: 0.035;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 200px 200px;
            pointer-events: none;
          }

          .landing-lines {
            position: absolute; inset: 0; pointer-events: none;
            background-image:
              linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
            background-size: 80px 80px;
          }

          .landing-center {
            position: relative; z-index: 2;
            text-align: center;
            max-width: 520px;
            padding: 0 24px;
            animation: fadeUp 0.8s ease both;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .eyebrow {
            font-family: 'DM Sans', sans-serif;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 20px;
            display: flex; align-items: center; justify-content: center; gap: 10px;
          }
          .eyebrow::before, .eyebrow::after {
            content: ''; display: block; width: 32px; height: 1px; background: var(--gold-dim);
          }

          .landing-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(42px, 8vw, 72px);
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -0.02em;
            color: var(--text);
            margin-bottom: 16px;
          }

          .landing-title em {
            font-style: italic;
            color: var(--gold-light);
          }

          .landing-sub {
            font-size: 15px;
            font-weight: 300;
            color: var(--muted);
            line-height: 1.7;
            margin-bottom: 44px;
          }

          .connect-btn {
            display: inline-flex; align-items: center; gap: 10px;
            background: var(--gold);
            color: #080808;
            border: none; cursor: pointer;
            padding: 14px 36px;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-radius: 2px;
            transition: all 0.2s;
            position: relative; overflow: hidden;
          }
          .connect-btn::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(255,255,255,0);
            transition: background 0.2s;
          }
          .connect-btn:hover::after { background: rgba(255,255,255,0.12); }
          .connect-btn:active { transform: scale(0.98); }
          .connect-btn:disabled { opacity: 0.6; cursor: not-allowed; }

          .connect-pulse {
            width: 6px; height: 6px; border-radius: 50%; background: #080808;
            animation: pulse 1.2s ease-in-out infinite;
          }
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.6)} }

          .landing-footer {
            margin-top: 48px;
            display: flex; justify-content: center; gap: 32px;
          }
          .stat-pill { text-align: center; }
          .stat-pill .num {
            font-family: 'Playfair Display', serif;
            font-size: 22px; font-weight: 700;
            color: var(--gold-light);
            display: block;
          }
          .stat-pill .lbl {
            font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
            color: var(--muted); margin-top: 4px;
          }
          .stat-divider { width: 1px; background: var(--border); }
        `}</style>
        <div className="landing">
          <div className="landing-bg" />
          <div className="noise" />
          <div className="landing-lines" />
          <div className="landing-center">
            <div className="eyebrow">Blockchain Royalties</div>
            <h1 className="landing-title">Your Music.<br/><em>Your Earnings.</em></h1>
            <p className="landing-sub">
              Distribute royalties on-chain, generate legal agreements,<br/>
              and track every payment in real time.
            </p>
            <button className="connect-btn" onClick={connect} disabled={connecting}>
              {connecting && <span className="connect-pulse" />}
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
            <div className="landing-footer">
              <div className="stat-pill"><span className="num">0%</span><span className="lbl">Platform Fee</span></div>
              <div className="stat-divider" />
              <div className="stat-pill"><span className="num">On-Chain</span><span className="lbl">Immutable Records</span></div>
              <div className="stat-divider" />
              <div className="stat-pill"><span className="num">Instant</span><span className="lbl">Distributions</span></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: #8A6A28;
          --bg: #080808;
          --surface: #111111;
          --surface2: #161616;
          --border: rgba(201,168,76,0.12);
          --border-soft: rgba(255,255,255,0.06);
          --text: #F0EDE6;
          --muted: #6B6560;
        }
        html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }

        .app-shell { min-height: 100vh; display: flex; flex-direction: column; }

        /* TOP BAR */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          height: 60px;
          border-bottom: 1px solid var(--border);
          background: rgba(8,8,8,0.9);
          backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 100;
        }

        .topbar-brand {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text);
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .brand-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); }

        .topbar-nav {
          display: flex; align-items: center; gap: 2px;
        }
        .nav-link {
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 2px;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--gold); }

        .topbar-right { display: flex; align-items: center; gap: 12px; }

        .wallet-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 12px;
          background: rgba(201,168,76,0.08);
          border: 1px solid var(--border);
          border-radius: 2px;
          font-size: 11px;
          font-weight: 500;
          color: var(--gold-light);
          letter-spacing: 0.04em;
          font-family: 'DM Sans', monospace;
        }
        .wallet-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ADE80; flex-shrink: 0; }

        .switch-btn {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid var(--border-soft);
          color: var(--muted);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .switch-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

        /* MAIN */
        .app-main { flex: 1; padding: 40px 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
      `}</style>
      <AppNav wallet={wallet} connect={connect} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard wallet={wallet} signer={signer} provider={provider} />} />
          <Route path="/create" element={<CreateSong wallet={wallet} signer={signer} provider={provider} />} />
        </Routes>
      </main>
    </>
  );
}

function AppNav({ wallet, connect }) {
  const location = useLocation();
  return (
    <nav className="topbar">
      <Link to="/" className="topbar-brand">
        <span className="brand-dot" /> Royalty
      </Link>
      <div className="topbar-nav">
        <Link to="/" className={`nav-link${location.pathname === "/" ? " active" : ""}`}>Dashboard</Link>
        <Link to="/create" className={`nav-link${location.pathname === "/create" ? " active" : ""}`}>Distribute</Link>
      </div>
      <div className="topbar-right">
        <div className="wallet-chip">
          <span className="wallet-dot" />
          {wallet.slice(0, 6)}…{wallet.slice(-4)}
        </div>
        <button className="switch-btn" onClick={connect}>Switch</button>
      </div>
    </nav>
  );
}