import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFactoryContract } from "../blockchain/factory";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* KEEP YOUR STYLES EXACTLY AS-IS */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .dash-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold, #C9A84C);
    margin-bottom: 6px;
  }

  .dash-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700; line-height: 1.1;
    letter-spacing: -0.02em;
    color: #F0EDE6;
  }
  .dash-title em { font-style: italic; color: #E8C97A; }

  .dash-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(201,168,76,0.1);
  }

  .create-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #C9A84C;
    color: #080808;
    text-decoration: none;
    padding: 11px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 2px;
    transition: opacity 0.15s, transform 0.15s;
  }
  .create-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .create-btn svg { width: 14px; height: 14px; }

  /* STATS ROW */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 40px;
  }

  .stat-card {
    background: #0E0E0E;
    padding: 24px 28px;
    position: relative;
  }
  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .stat-card:hover::before { opacity: 1; }

  .stat-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #6B6560;
    margin-bottom: 10px;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700;
    color: #E8C97A;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .stat-sub {
    font-size: 11px; color: #6B6560;
    margin-top: 6px;
  }

  /* SECTION HEADER */
  .section-hd {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .section-title {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #6B6560;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title::after {
    content: ''; flex: 1; min-width: 40px; height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .section-count {
    font-size: 11px; color: #C9A84C;
    background: rgba(201,168,76,0.08);
    padding: 3px 10px; border-radius: 20px;
    border: 1px solid rgba(201,168,76,0.15);
  }

  /* EMPTY */
  .empty-state {
    text-align: center;
    padding: 64px 24px;
    border: 1px dashed rgba(201,168,76,0.15);
    border-radius: 4px;
  }
  .empty-icon {
    font-size: 36px; margin-bottom: 16px; opacity: 0.5;
  }
  .empty-text {
    font-size: 14px; color: #6B6560;
    margin-bottom: 24px;
  }

  /* LOADING */
  .loading-bar {
    height: 1px;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
    animation: shimmer 1.5s ease-in-out infinite;
    margin-bottom: 40px;
    border-radius: 1px;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  /* SONG CARD */
  .song-card {
    background: #0E0E0E;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 4px;
    padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .song-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.03), transparent 60%);
    pointer-events: none;
  }
  .song-card:hover {
    border-color: rgba(201,168,76,0.2);
    transform: translateY(-2px);
  }

  .song-number {
    font-family: 'Playfair Display', serif;
    font-size: 11px; font-weight: 400;
    color: rgba(201,168,76,0.3);
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }

  .song-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: #F0EDE6;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .song-address {
    font-size: 10px; font-weight: 400;
    color: #4A4540;
    font-family: 'DM Sans', monospace;
    letter-spacing: 0.04em;
    word-break: break-all;
    line-height: 1.6;
  }

  .song-footer {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 20px; padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .active-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #4ADE80;
  }
  .active-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ADE80; }

  .view-link {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #C9A84C;
    text-decoration: none;
    display: flex; align-items: center; gap: 5px;
    transition: gap 0.15s;
  }
  .view-link:hover { gap: 8px; }
  .view-link::after { content: '→'; }

  /* GRID */
  .songs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ABOUT STRIP */
  .about-strip {
    margin-top: 56px;
    padding-top: 40px;
    border-top: 1px solid rgba(201,168,76,0.08);
  }

  .about-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 32px;
    gap: 24px;
  }

  .about-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 700; line-height: 1.15;
    letter-spacing: -0.02em;
    color: #F0EDE6;
    max-width: 380px;
  }
  .about-headline em { font-style: italic; color: #E8C97A; }

  .about-lede {
    font-size: 13px; font-weight: 300; line-height: 1.8;
    color: #6B6560; max-width: 340px; text-align: right;
  }

  /* SERVICE CARDS */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.08);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .service-card {
    background: #0A0A0A;
    padding: 28px 24px;
    position: relative;
    transition: background 0.2s;
  }
  .service-card:hover { background: #0F0F0F; }

  .service-icon {
    width: 36px; height: 36px;
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    font-size: 15px;
  }

  .service-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700;
    color: #F0EDE6;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .service-desc {
    font-size: 12px; font-weight: 300; line-height: 1.75;
    color: #5A5550;
  }

  /* TESTIMONIALS */
  .reviews-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .review-card {
    background: #0A0A0A;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 4px;
    padding: 22px 20px;
  }

  .review-stars {
    display: flex; gap: 3px;
    margin-bottom: 12px;
  }
  .star { color: #C9A84C; font-size: 11px; }

  .review-quote {
    font-size: 12px; font-weight: 300; line-height: 1.75;
    color: #7A7570;
    margin-bottom: 16px;
    font-style: italic;
  }

  .review-author {
    display: flex; align-items: center; gap: 10px;
  }
  .author-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #C9A84C22, #C9A84C44);
    border: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #C9A84C;
    flex-shrink: 0;
  }
  .author-name {
    font-size: 11px; font-weight: 500; color: #9A9590;
    letter-spacing: 0.04em;
  }
  .author-role {
    font-size: 10px; color: #4A4540;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
`;

export default function Dashboard({ wallet }) {
  const [songs, setSongs] = useState([]);
  const [totalSent, setTotalSent] = useState("0");
  const [txCount, setTxCount] = useState("0");
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // SONGS
  // -----------------------------
  async function loadSongs(factory) {
    try {
      const data = await factory.getSongs();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load songs:", err);
      setSongs([]);
    }
  }

  // -----------------------------
  // TOTAL SENT (SAFE)
  // -----------------------------
  async function loadTotalSent(factory, userAddress) {
    try {
      if (!userAddress) return;

      if (!factory.getTotalSent) {
        setTotalSent("0");
        return;
      }

      const data = await factory.getTotalSent(userAddress);
      setTotalSent(ethers.formatEther(data || 0));
    } catch (err) {
      console.error("Failed to load total sent:", err);
      setTotalSent("0");
    }
  }

  // -----------------------------
  // TX COUNT (SAFE + FALLBACK)
  // -----------------------------
  async function loadTxCount(factory, userAddress) {
    try {
      if (!userAddress) return;

      // IMPORTANT: only works if you implemented this in Solidity
      if (!factory.getTotalTransactions) {
        setTxCount("0");
        return;
      }

      const data = await factory.getTotalTransactions(userAddress);
      setTxCount(data?.toString?.() || "0");
    } catch (err) {
      console.error("Failed to load tx count:", err);
      setTxCount("0");
    }
  }

  // -----------------------------
  // INIT
  // -----------------------------
  async function init() {
    try {
      if (!window.ethereum || !wallet) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = getFactoryContract(provider);

      await Promise.all([
        loadSongs(factory),
        loadTotalSent(factory, wallet),
        loadTxCount(factory, wallet),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [wallet]);

  // -----------------------------
  // UI (UNCHANGED)
  // -----------------------------
  return (
    <>
      <style>{styles}</style>

      <div className="dash-header">
        <div>
          <div className="dash-eyebrow">Overview</div>
          <h1 className="dash-title">
            Your <em>Royalty</em> Portfolio
          </h1>
        </div>

        <Link to="/create" className="create-btn">
          + New Distribution
        </Link>
      </div>

      {loading && <div className="loading-bar" />}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Distributed</div>
          <div className="stat-value">
            {loading ? "—" : parseFloat(totalSent || "0").toFixed(4)}
          </div>
          <div className="stat-sub">ETH sent to contributors</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Royalty Transactions</div>
          <div className="stat-value">{loading ? "—" : parseFloat(totalSent || "0").toFixed(4)}</div>
          <div className="stat-sub">Total distributions made</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Network</div>
          <div className="stat-value">Ethereum</div>
          <div className="stat-sub">Sepolia / Testnet</div>
        </div>
      </div>

       {/* SONGS SECTION */}
      <div className="section-hd">
        <div className="section-title">Registered Songs</div>
        {!loading && <span className="section-count">{songs.length} total</span>}
      </div>

      {!loading && songs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">𝄞</div>
          <div className="empty-text">No songs registered yet.<br/>Create your first royalty split to get started.</div>
          <Link to="/create" className="create-btn" style={{display:'inline-flex'}}>
            Create First Song
          </Link>
        </div>
      )}

      <div className="songs-grid">
        {songs.map((song, i) => (
          <motion.div
            key={song.contractAddress || i}
            className="song-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="song-number">No. {String(i + 1).padStart(2, "0")}</div>
            <div className="song-name">{song.title}</div>
            <div className="song-address">{song.contractAddress}</div>
            <div className="song-footer">
              <div className="active-badge">
                <span className="active-dot" /> Active
              </div>
              <Link to={`/song/${song.contractAddress}`} className="view-link">
                View
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── ABOUT / SERVICES ── */}
      <div className="about-strip">
        <div className="about-header">
          <h2 className="about-headline">
            The <em>smartest</em> way to split music royalties
          </h2>
          <p className="about-lede">
            Built on Ethereum. No middlemen, no delays —
            every payment is a transparent, immutable transaction
            executed the moment you confirm.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">⛓</div>
            <div className="service-title">On-Chain Splits</div>
            <div className="service-desc">
              Define contributor shares once and distribute royalties
              directly to every wallet in a single transaction.
              No escrow, no platform custody.
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📄</div>
            <div className="service-title">Legal Agreements</div>
            <div className="service-desc">
              Generate a signed PDF royalty agreement for every song —
              an off-chain paper trail that mirrors your on-chain splits.
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📊</div>
            <div className="service-title">Live Analytics</div>
            <div className="service-desc">
              Track cumulative ETH distributed, transaction history,
              and contributor payouts — all pulled in real time
              from the blockchain.
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="section-hd" style={{marginBottom:'16px'}}>
          <div className="section-title">What artists are saying</div>
        </div>
        <div className="reviews-row">
          {[
            {
              quote: "Finally a tool that treats royalties like the serious business they are. Paid out three co-writers in one click.",
              name: "Amara O.", role: "Producer · Lagos",
              avatar: "AO", stars: 5
            },
            {
              quote: "The PDF agreement alone saved us a lawyer's bill. The on-chain record gives my label zero room to dispute splits.",
              name: "Marco V.", role: "Songwriter · Milan",
              avatar: "MV", stars: 5
            },
            {
              quote: "Transparent, fast, and no platform taking a cut. This is what Web3 music infrastructure should look like.",
              name: "Jaylen R.", role: "Indie Artist · Atlanta",
              avatar: "JR", stars: 5
            }
          ].map((r, i) => (
            <motion.div
              key={i} className="review-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="review-stars">
                {Array(r.stars).fill(0).map((_, s) => <span className="star" key={s}>★</span>)}
              </div>
              <div className="review-quote">"{r.quote}"</div>
              <div className="review-author">
                <div className="author-avatar">{r.avatar}</div>
                <div>
                  <div className="author-name">{r.name}</div>
                  <div className="author-role">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}