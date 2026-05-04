import { useState } from "react";
import { ethers } from "ethers";
import { jsPDF } from "jspdf";
import { getFactoryContract } from "../blockchain/factory";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: #8A6A28;
    --bg: #080808;
    --surface: #0E0E0E;
    --border: rgba(201,168,76,0.12);
    --border-soft: rgba(255,255,255,0.06);
    --text: #F0EDE6;
    --muted: #6B6560;
  }

  .create-page {
    max-width: 680px;
  }

  .create-eyebrow {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }

  .create-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700; line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 4px;
  }
  .create-heading em { font-style: italic; color: var(--gold-light); }

  .create-sub {
    font-size: 13px; color: var(--muted);
    font-weight: 300; margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(201,168,76,0.1);
  }

  /* FIELD */
  .field-group { margin-bottom: 28px; }

  .field-label {
    display: block;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .field-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border-soft);
    color: var(--text);
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.2s;
  }
  .field-input:focus { border-color: rgba(201,168,76,0.4); }
  .field-input::placeholder { color: #3A3530; }

  /* SHARE PROGRESS */
  .share-bar-wrap {
    height: 3px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .share-bar-fill {
    height: 100%; border-radius: 2px;
    transition: width 0.3s ease, background 0.3s;
  }
  .share-bar-label {
    display: flex; justify-content: space-between;
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  /* CONTRIBUTOR ROW */
  .contributors-list { display: flex; flex-direction: column; gap: 10px; }

  .contributor-row {
    display: grid; grid-template-columns: 1fr 2fr 80px 32px;
    gap: 8px; align-items: stretch;
  }

  .contributor-input {
    background: var(--surface);
    border: 1px solid var(--border-soft);
    color: var(--text);
    padding: 11px 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .contributor-input:focus { border-color: rgba(201,168,76,0.35); }
  .contributor-input::placeholder { color: #3A3530; }
  .contributor-input.share { text-align: center; }

  .remove-btn {
    background: transparent;
    border: 1px solid var(--border-soft);
    color: var(--muted);
    cursor: pointer;
    border-radius: 2px;
    font-size: 16px; line-height: 1;
    transition: color 0.15s, border-color 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .remove-btn:hover { color: #EF4444; border-color: rgba(239,68,68,0.3); }

  .add-contributor-btn {
    display: flex; align-items: center; gap: 8px;
    background: transparent;
    border: 1px dashed rgba(201,168,76,0.2);
    color: var(--gold-dim);
    padding: 11px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 2px;
    cursor: pointer;
    width: 100%;
    transition: color 0.2s, border-color 0.2s;
    margin-top: 10px;
  }
  .add-contributor-btn:hover { color: var(--gold); border-color: rgba(201,168,76,0.4); }

  /* DIVIDER */
  .section-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin: 32px 0;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.05);
  }

  /* ACTIONS */
  .action-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-top: 32px;
  }

  .btn-pdf {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent;
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold-light);
    padding: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 2px; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-pdf:hover { background: rgba(201,168,76,0.07); border-color: rgba(201,168,76,0.5); }

  .btn-send {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--gold);
    border: none;
    color: #080808;
    padding: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 2px; cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-send:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .btn-send:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* SUCCESS TOAST */
  .toast {
    position: fixed; bottom: 32px; right: 32px;
    background: #0E0E0E; border: 1px solid rgba(74,222,128,0.25);
    padding: 16px 22px;
    border-radius: 3px;
    display: flex; align-items: center; gap: 12px;
    animation: slideUp 0.3s ease;
    z-index: 999;
  }
  @keyframes slideUp { from {opacity:0;transform:translateY(12px)} to {opacity:1;transform:translateY(0)} }
  .toast-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ADE80; flex-shrink: 0; }
  .toast-text { font-size: 13px; color: #F0EDE6; }

  /* ETH HINT */
  .eth-input-wrap { position: relative; }
  .eth-suffix {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 12px; color: var(--muted);
    font-weight: 500; letter-spacing: 0.1em;
    pointer-events: none;
  }

  .validation-hint {
    font-size: 11px; margin-top: 8px;
    display: flex; align-items: center; gap: 5px;
  }
  .valid { color: #4ADE80; }
  .invalid { color: #F87171; }
`;

export default function CreateSong({ wallet }) {
  const [title, setTitle] = useState("");
  const [contributors, setContributors] = useState([
    { role: "Producer", address: "", share: "" },
    { role: "Vocalist", address: "", share: "" },
  ]);
  const [earned, setEarned] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalShares = contributors.reduce((s, c) => s + Number(c.share || 0), 0);
  const sharesValid = totalShares === 100;
  const addressesValid = contributors.every(c => !c.address || ethers.isAddress(c.address));

  function addContributor() {
    setContributors([...contributors, { role: "", address: "", share: "" }]);
  }

  function removeContributor(index) {
    if (contributors.length <= 1) return;
    setContributors(contributors.filter((_, i) => i !== index));
  }

  function updateContributor(index, field, value) {
    const updated = [...contributors];
    updated[index][field] = value;
    setContributors(updated);
  }

  function validateShares() {
    return contributors.reduce((s, c) => s + Number(c.share || 0), 0) === 100;
  }

  function validateAddresses() {
    return contributors.every(c => ethers.isAddress(c.address));
  }

  function generateAgreementPDF() {
    if (!title) return alert("Add song title");
    if (!validateShares()) return alert("Shares must equal 100%");
    if (!validateAddresses()) return alert("Invalid wallet address detected");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Royalty Split Agreement", 20, 22);
    doc.setFontSize(11);
    doc.text(`Song: ${title}`, 20, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 46);

    let y = 62;
    doc.setFontSize(10);
    contributors.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.role}  |  ${c.address}  |  ${c.share}%`, 20, y);
      y += 9;
    });

    doc.text("This document defines royalty distribution among contributors.", 20, y + 16);
    doc.save(`${title}-royalty-agreement.pdf`);
  }

  async function distributeRoyalties() {
    try {
      if (!window.ethereum) return alert("Install MetaMask");
      if (!validateShares()) return alert("Shares must equal 100%");
      if (!validateAddresses()) return alert("Invalid wallet address detected");
      if (!earned || Number(earned) <= 0) return alert("Enter valid ETH amount");

      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = getFactoryContract(signer);

      const payees = contributors.map(c => c.address);
      const shares = contributors.map(c => Number(c.share));
      const value = ethers.parseEther(earned.toString());

      const tx = await factory.distributeRoyalties(payees, shares, { value });
      await tx.wait();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  const barColor = totalShares > 100 ? "#F87171" : totalShares === 100 ? "#4ADE80" : "#C9A84C";

  return (
    <>
      <style>{styles}</style>
      <div className="create-page">

        {/* HEADER */}
        <div className="create-eyebrow">Distribution</div>
        <h1 className="create-heading">Split <em>Royalties</em></h1>
        <p className="create-sub">Define contributors, shares, and send payments on-chain.</p>

        {/* SONG TITLE */}
        <div className="field-group">
          <label className="field-label">Song Title</label>
          <input
            className="field-input"
            placeholder="e.g. Midnight Boulevard"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <hr className="section-divider" />

        {/* CONTRIBUTORS */}
        <div className="section-label">Contributors</div>

        {/* SHARE BAR */}
        <div className="share-bar-label">
          <span>Allocated</span>
          <span style={{ color: barColor }}>{totalShares}% / 100%</span>
        </div>
        <div className="share-bar-wrap">
          <div className="share-bar-fill" style={{
            width: `${Math.min(totalShares, 100)}%`,
            background: barColor
          }} />
        </div>

        <div className="contributors-list">
          {contributors.map((c, i) => (
            <div className="contributor-row" key={i}>
              <input
                className="contributor-input"
                placeholder="Role"
                value={c.role}
                onChange={e => updateContributor(i, "role", e.target.value)}
              />
              <input
                className="contributor-input"
                placeholder="0x Wallet Address"
                value={c.address}
                style={{ borderColor: c.address && !ethers.isAddress(c.address) ? 'rgba(248,113,113,0.4)' : undefined }}
                onChange={e => updateContributor(i, "address", e.target.value)}
              />
              <input
                className="contributor-input share"
                placeholder="%"
                value={c.share}
                onChange={e => updateContributor(i, "share", e.target.value)}
              />
              <button className="remove-btn" onClick={() => removeContributor(i)} title="Remove">×</button>
            </div>
          ))}
        </div>

        <button className="add-contributor-btn" onClick={addContributor}>
          + Add Contributor
        </button>

        <hr className="section-divider" />

        {/* AMOUNT */}
        <div className="section-label">Royalty Amount</div>
        <div className="field-group">
          <div className="eth-input-wrap">
            <input
              className="field-input"
              placeholder="0.000"
              style={{ paddingRight: '50px' }}
              value={earned}
              onChange={e => setEarned(e.target.value)}
            />
            <span className="eth-suffix">ETH</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="action-row">
          <button className="btn-pdf" onClick={generateAgreementPDF}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 10.5V12h10v-1.5M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download PDF
          </button>
          <button className="btn-send" onClick={distributeRoyalties} disabled={loading}>
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{animation:'spin 1s linear infinite'}}>
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="8" strokeLinecap="round"/>
                </svg>
                Sending…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 7h11M8 2.5 12.5 7 8 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send Royalties
              </>
            )}
          </button>
        </div>

      </div>

      {/* SUCCESS TOAST */}
      {success && (
        <div className="toast">
          <span className="toast-dot" />
          <span className="toast-text">Royalties sent successfully</span>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}