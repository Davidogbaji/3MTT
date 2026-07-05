import React, { useState } from "react";
import { Sprout, TrendingUp, Store, PackageSearch, Menu, X } from "lucide-react";
import Home from "./components/Home.jsx";
import PriceChecker from "./components/PriceChecker.jsx";
import Marketplace from "./components/Marketplace.jsx";
import StorageTips from "./components/StorageTips.jsx";

const TABS = [
  { key: "home", label: "Home", icon: Sprout },
  { key: "price", label: "Price Checker", icon: TrendingUp },
  { key: "market", label: "Marketplace", icon: Store },
  { key: "storage", label: "Storage Tips", icon: PackageSearch },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (key) => {
    setScreen(key);
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <style>{`
        .app-shell { min-height: 100vh; display: flex; flex-direction: column; }

        .top-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; background: var(--green-dark); color: #fff;
        }
        .brand { display: flex; align-items: center; gap: 8px; font-family: "Space Grotesk", sans-serif; font-weight: 700; font-size: 19px; }

        .desktop-nav { display: none; gap: 6px; }
        .desktop-nav button {
          display: flex; align-items: center; gap: 7px; background: transparent; border: none;
          color: #CFE0CC; font-size: 14px; font-weight: 600; padding: 9px 14px; border-radius: 10px; cursor: pointer;
        }
        .desktop-nav button.active { background: rgba(255,255,255,0.12); color: #fff; }

        .menu-btn { display: flex; background: none; border: none; color: #fff; cursor: pointer; }

        .content { flex: 1; width: 100%; max-width: 1080px; margin: 0 auto; padding-bottom: 78px; }

        .mobile-nav {
          position: fixed; bottom: 0; left: 0; right: 0; background: var(--card);
          border-top: 1px solid var(--border); display: flex; padding: 8px 4px; z-index: 20;
        }
        .mobile-nav button {
          flex: 1; background: none; border: none; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; gap: 3px; padding: 6px 0; color: var(--ink-soft);
        }
        .mobile-nav button.active { color: var(--green); }
        .mobile-nav span { font-size: 10.5px; font-weight: 600; }

        @media (min-width: 780px) {
          .desktop-nav { display: flex; }
          .menu-btn { display: none; }
          .mobile-nav { display: none; }
          .content { padding-bottom: 32px; padding-left: 24px; padding-right: 24px; }
        }
      `}</style>

      <div className="top-bar">
        <div className="brand"><Sprout size={22} color="#D9A441" /> AgriLink</div>
        <nav className="desktop-nav">
          {TABS.map((t) => (
            <button key={t.key} className={screen === t.key ? "active" : ""} onClick={() => go(t.key)}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="content">
        {screen === "home" && <Home go={go} />}
        {screen === "price" && <PriceChecker />}
        {screen === "market" && <Marketplace />}
        {screen === "storage" && <StorageTips />}
      </div>

      <nav className="mobile-nav">
        {TABS.map((t) => (
          <button key={t.key} className={screen === t.key ? "active" : ""} onClick={() => go(t.key)}>
            <t.icon size={20} strokeWidth={screen === t.key ? 2.4 : 2} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
