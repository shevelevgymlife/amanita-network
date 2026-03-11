import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

const projectId = process.env.REACT_APP_WC_PROJECT_ID;

const decimalChain = {
  id: 75,
  name: "Decimal Smart Chain",
  network: "decimal",
  nativeCurrency: { name: "DEL", symbol: "DEL", decimals: 18 },
  rpcUrls: { default: { http: ["https://node.decimalchain.com/web3/"] } },
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [decimalChain],
  defaultNetwork: decimalChain,
  metadata: {
    name: "Amanita Network",
    description: "Amanita Network",
    url: "https://amanita-network.onrender.com",
    icons: ["https://amanita-network.onrender.com/favicon.ico"]
  },
  features: { email: false, socials: false }
});

const REPUTATION_ADDRESS = "0xdb62AD6F2f4bb1c5D230aCeaCb937530746C5e13";
const SHEVELEV_ADDRESS = "0xb5c1933b1fa015818ac2c53812f67611c48e6b56";

const REPUTATION_ABI = [
  "function getTier(address user) view returns (uint8)",
  "function register(string nickname, uint8 avatarIndex) external",
  "function isRegistered(address) view returns (bool)",
  "function userNickname(address) view returns (string)",
  "function getLeaderboardPage(uint256 offset, uint256 limit) view returns (address[], uint256[], string[], uint8[], uint8[])"
];

const SHEVELEV_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

const TIERS = {
  1: { name: "Зерно", icon: "🌱", color: "#9ca3af", min: "0" },
  2: { name: "Участник", icon: "🍄", color: "#4ade80", min: "100" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0", min: "1,000" },
  4: { name: "Мастер", icon: "🔮", color: "#c084fc", min: "10,000" },
  5: { name: "Легенда", icon: "⚜️", color: "#fbbf24", min: "50,000" }
};

const MENU_ITEMS = [
  { id: "profile", icon: "👤", label: "Моя страница" },
  { id: "feed", icon: "📝", label: "Лента" },
  { id: "chats", icon: "💬", label: "Чаты" },
  { id: "create_chat", icon: "➕", label: "Создать чат" },
  { id: "others", icon: "👥", label: "Другие" },
  { id: "disclaimer", icon: "⚠️", label: "Дисклеймер" },
];

const MUSHROOM_SVG = `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="55" rx="45" ry="30" fill="white" opacity="0.03"/>
  <ellipse cx="50" cy="52" rx="42" ry="28" fill="white" opacity="0.03"/>
  <rect x="38" y="55" width="24" height="40" rx="6" fill="white" opacity="0.03"/>
  <ellipse cx="35" cy="62" rx="6" ry="4" fill="white" opacity="0.04"/>
  <ellipse cx="65" cy="58" rx="5" ry="3" fill="white" opacity="0.04"/>
  <ellipse cx="50" cy="60" rx="4" ry="3" fill="white" opacity="0.04"/>
</svg>`;

export default function App() {
  const [account, setAccount] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);
  const [nickname, setNickname] = useState("");
  const [registered, setRegistered] = useState(false);
  const [inputNick, setInputNick] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    modal.subscribeAccount(async (acc) => {
      if (acc.address) {
        setAccount(acc.address);
        await loadUser(acc.address);
      } else {
        setAccount(null);
        setTier(null);
        setBalance(null);
        setNickname("");
        setRegistered(false);
      }
    });
    loadTotalUsers();
  }, []);

  useEffect(() => {
    if (totalUsers === 0) return;
    let start = 0;
    const step = totalUsers / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= totalUsers) {
        setDisplayCount(totalUsers);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [totalUsers]);

  async function loadTotalUsers() {
    try {
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const [addrs] = await rep.getLeaderboardPage(0, 1000);
      const registered = addrs.filter(a => a !== "0x0000000000000000000000000000000000000000");
      setTotalUsers(registered.length);
    } catch (e) {
      setTotalUsers(0);
    }
  }

  async function loadUser(addr) {
    try {
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const [t, bal, isReg] = await Promise.all([
        rep.getTier(addr),
        shev.balanceOf(addr),
        rep.isRegistered(addr)
      ]);
      setTier(Number(t));
      setBalance(ethers.formatEther(bal));
      setRegistered(isReg);
      if (isReg) setNickname(await rep.userNickname(addr));
    } catch (e) {
      console.error(e);
    }
  }

  async function registerUser() {
    if (!inputNick) return;
    setLoading(true);
    try {
      const walletProvider = modal.getWalletProvider();
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, signer);
      const tx = await rep.register(inputNick, 0);
      await tx.wait();
      setRegistered(true);
      setNickname(inputNick);
      setTotalUsers(prev => prev + 1);
    } catch (e) {
      alert("Ошибка: " + e.message);
    }
    setLoading(false);
  }

  async function loadLeaderboard() {
    try {
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const [addrs, , nicks, , tiers] = await rep.getLeaderboardPage(0, 50);
      const data = await Promise.all(addrs.map(async (a, i) => {
        const bal = await shev.balanceOf(a);
        return { address: a, balance: ethers.formatEther(bal), nickname: nicks[i], tier: Number(tiers[i]) };
      }));
      data.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
      setLeaderboard(data);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    if (page === "others") loadLeaderboard();
  }, [page]);

  const tierInfo = tier ? TIERS[tier] : null;
  function navigate(id) { setPage(id); setMenuOpen(false); }

  const styles = {
    page: { minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif", fontWeight: 500, position: "relative", overflow: "hidden" },
    header: { background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2rem", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
    btn: { background: "linear-gradient(135deg, #00c4a0, #0099cc)", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(10px)" },
    input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.95rem", outline: "none", fontFamily: "'Rubik', sans-serif" },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; }
        body { background: #0f1117; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #00c4a0; border-radius: 2px; }
        .menu-item:hover { background: rgba(255,255,255,0.06) !important; }
        .card-hover:hover { border-color: rgba(0,196,160,0.3) !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* МУХОМОРЫ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[
          { top: "5%", left: "2%", size: 180, rotate: -15 },
          { top: "20%", right: "3%", size: 140, rotate: 10 },
          { top: "50%", left: "1%", size: 120, rotate: -5 },
          { top: "70%", right: "5%", size: 160, rotate: 20 },
          { top: "85%", left: "8%", size: 100, rotate: -10 },
          { top: "10%", left: "45%", size: 90, rotate: 5 },
          { top: "60%", left: "50%", size: 130, rotate: -20 },
        ].map((m, i) => (
          <div key={i} style={{ position: "absolute", top: m.top, left: m.left, right: m.right, width: m.size, height: m.size, transform: `rotate(${m.rotate}deg)`, opacity: 0.4 }}
            dangerouslySetInnerHTML={{ __html: MUSHROOM_SVG }} />
        ))}
      </div>

      {/* HEADER */}
      <div style={styles.header}>
        <div onClick={() => navigate("home")} style={{ fontSize: "1.3rem", color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}>
          🍄 <span style={{ background: "linear-gradient(135deg, #00c4a0, #0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AMANITA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {account && <div style={{ fontSize: "0.75rem", color: "#00c4a0", background: "rgba(0,196,160,0.1)", padding: "0.3rem 0.8rem", borderRadius: "20px", border: "1px solid rgba(0,196,160,0.2)" }}>{account.slice(0,6)}...{account.slice(-4)}</div>}
          {!account && <button onClick={() => modal.open()} style={styles.btn}>🦊 Войти</button>}
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", width: "40px", height: "40px", borderRadius: "8px", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>☰</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: "3rem", background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", minWidth: "220px", zIndex: 200, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="menu-item" onClick={() => navigate(item.id)} style={{ padding: "0.8rem 1.2rem", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.75rem", color: page === item.id ? "#00c4a0" : "#e2e8f0", fontSize: "0.9rem" }}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
                {account && (
                  <div className="menu-item" onClick={() => { modal.disconnect(); setMenuOpen(false); setPage("home"); }} style={{ padding: "0.8rem 1.2rem", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem" }}>
                    <span>🚪</span><span>Выйти</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem", position: "relative", zIndex: 1 }}>

        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem", filter: "drop-shadow(0 0 30px rgba(0,196,160,0.3))" }}>🍄</div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "1rem" }}>
                Amanita<br/>
                <span style={{ background: "linear-gradient(135deg, #00c4a0, #0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Network</span>
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "400px", margin: "0 auto 2rem" }}>Открытая децентрализованная сеть для обмена опытом</p>

              {/* СЧЁТЧИК */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", background: "rgba(0,196,160,0.08)", border: "1px solid rgba(0,196,160,0.2)", borderRadius: "16px", padding: "1.2rem 2.5rem", marginBottom: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#00c4a0", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{displayCount}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>участников в сети</div>
                </div>
              </div>

              {!account && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <button onClick={() => modal.open()} style={{ ...styles.btn, padding: "0.9rem 2.5rem", fontSize: "1rem", borderRadius: "12px", boxShadow: "0 0 30px rgba(0,196,160,0.3)" }}>
                    🦊 Войти через MetaMask
                  </button>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Расширение для браузера или мобильное приложение</div>
                </div>
              )}
            </div>

            {account && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: "1.5rem" }} className="card-hover">
                  <div style={{ fontSize: "3rem" }}>{tierInfo?.icon || "🌱"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: tierInfo?.color || "#9ca3af", fontSize: "1.1rem", fontWeight: 700 }}>{tierInfo?.name || "Зерно"}</div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} токенов SHEVELEV</div>
                  </div>
                  {registered && <div style={{ color: "#00c4a0", fontSize: "0.9rem" }}>👋 {nickname}</div>}
                </div>

                {!registered && (
                  <div style={styles.card}>
                    <p style={{ color: "#94a3b8", marginBottom: "0.75rem", fontSize: "0.9rem" }}>Выберите ник:</p>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <input value={inputNick} onChange={e => setInputNick(e.target.value)} placeholder="Ваш ник..." maxLength={32} style={styles.input} />
                      <button onClick={registerUser} disabled={loading} style={{ ...styles.btn, whiteSpace: "nowrap" }}>
                        {loading ? "..." : "Зарегистрироваться"}
                      </button>
                    </div>
                  </div>
                )}

                <div style={styles.card}>
                  <h3 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1rem" }}>Рейтинг Amanita Network</h3>
                  {Object.entries(TIERS).reverse().map(([t, info]) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", marginBottom: "0.4rem", border: `1px solid ${Number(t) === tier ? info.color + "40" : "transparent"}` }}>
                      <span style={{ fontSize: "1.3rem" }}>{info.icon}</span>
                      <span style={{ color: info.color, width: "90px", fontSize: "0.9rem" }}>{info.name}</span>
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>от {info.min} токенов SHEVELEV</span>
                      {Number(t) === tier && <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: info.color, background: info.color + "20", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>Ваш уровень</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!account && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ ...styles.card }}>
                  <h3 style={{ color: "#00c4a0", marginBottom: "1rem", fontSize: "0.95rem" }}>Как войти?</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>💻</span>
                      <div>
                        <div style={{ color: "#fff", fontSize: "0.9rem" }}>Через браузер</div>
                        <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Установите расширение MetaMask для Chrome, Edge или Firefox.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>📱</span>
                      <div>
                        <div style={{ color: "#fff", fontSize: "0.9rem" }}>Через телефон</div>
                        <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Установите приложение MetaMask. Откройте сайт через браузер внутри MetaMask.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {page === "profile" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>👤 Моя страница</h2>
            {!account
              ? <div style={{ ...styles.card, textAlign: "center", color: "#64748b", padding: "3rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
                  <p>Подключите кошелёк для просмотра профиля</p>
                  <button onClick={() => modal.open()} style={{ ...styles.btn, marginTop: "1rem" }}>🦊 Войти</button>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${tierInfo?.color || "#9ca3af"}, #0f1117)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{tierInfo?.icon || "🌱"}</div>
                    <div>
                      <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{nickname || "Без ника"}</div>
                      <div style={{ color: tierInfo?.color || "#9ca3af" }}>{tierInfo?.name || "Зерно"}</div>
                      <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} токенов SHEVELEV</div>
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Адрес кошелька</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem", wordBreak: "break-all", fontFamily: "monospace" }}>{account}</div>
                  </div>
                </div>
            }
          </div>
        )}

        {page === "feed" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>📝 Лента</h2>
            <div style={{ ...styles.card, textAlign: "center", color: "#64748b", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍄</div>
              <p>Лента постов скоро появится...</p>
            </div>
          </div>
        )}

        {page === "chats" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>💬 Чаты</h2>
            <div style={{ ...styles.card, textAlign: "center", color: "#64748b", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍄</div>
              <p>Чаты скоро появятся...</p>
            </div>
          </div>
        )}

        {page === "create_chat" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>➕ Создать чат</h2>
            <div style={{ ...styles.card, textAlign: "center", color: "#64748b", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍄</div>
              <p>Создание чатов скоро появится...</p>
            </div>
          </div>
        )}

        {page === "others" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>👥 Другие участники</h2>
            <div style={{ ...styles.card, marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#00c4a0", marginBottom: "1rem", fontSize: "0.95rem" }}>Как попасть в рейтинг?</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  ["1", "Установите MetaMask — расширение для браузера или приложение на телефон"],
                  ["2", "Добавьте сеть Decimal Smart Chain — при входе на сайт это произойдёт автоматически"],
                  ["3", "Получите токены SHEVELEV — чем больше токенов на кошельке, тем выше уровень"],
                  ["4", "Импортируйте токен SHEVELEV в MetaMask: 0xb5c1933b1fa015818ac2c53812f67611c48e6b56"]
                ].map(([num, text]) => (
                  <div key={num} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#00c4a0", background: "rgba(0,196,160,0.1)", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>{num}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            {leaderboard.length === 0
              ? <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Загрузка...</div>
              : leaderboard.map((u, i) => (
                <div key={i} style={{ ...styles.card, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }} className="card-hover">
                  <div style={{ color: "#64748b", width: "30px", textAlign: "center", fontSize: "0.85rem" }}>#{i+1}</div>
                  <div style={{ fontSize: "1.5rem" }}>{TIERS[u.tier]?.icon || "🌱"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: TIERS[u.tier]?.color || "#9ca3af", fontWeight: 700 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{parseFloat(u.balance).toLocaleString()} токенов SHEVELEV</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {page === "disclaimer" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>⚠️ Дисклеймер</h2>
            <div style={{ ...styles.card, lineHeight: 1.8 }}>
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>Amanita Network — открытая децентрализованная платформа для обмена личным опытом с Amanita muscaria исключительно в странах где это законно.</p>
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>Платформа не занимается продажей, рекламой или пропагандой каких-либо веществ.</p>
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>Перед любым использованием проконсультируйтесь с врачом.</p>
              <p style={{ color: "#f87171", fontWeight: 700 }}>⛔ Запрещено для лиц до 18 лет.</p>
            </div>
          </div>
        )}

      </div>

      <div style={{ textAlign: "center", padding: "1.5rem", color: "#334155", fontSize: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
        ⚠️ Только для легального личного опыта · Не реклама · Не продажа · Консультируйтесь с врачом
      </div>
    </div>
  );
}