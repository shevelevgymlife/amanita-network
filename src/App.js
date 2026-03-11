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
  1: { name: "Зерно", icon: "🌱", color: "#6b7280", min: "0" },
  2: { name: "Участник", icon: "🍄", color: "#22c55e", min: "100" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0", min: "1,000" },
  4: { name: "Мастер", icon: "🔮", color: "#e879f9", min: "10,000" },
  5: { name: "Легенда", icon: "⚜️", color: "#ffd700", min: "50,000" }
};

const MENU_ITEMS = [
  { id: "profile", icon: "👤", label: "Моя страница" },
  { id: "feed", icon: "📝", label: "Лента" },
  { id: "chats", icon: "💬", label: "Чаты" },
  { id: "create_chat", icon: "➕", label: "Создать чат" },
  { id: "others", icon: "👥", label: "Другие" },
  { id: "disclaimer", icon: "⚠️", label: "Дисклеймер" },
];

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
  }, []);

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
        return {
          address: a,
          balance: ethers.formatEther(bal),
          nickname: nicks[i],
          tier: Number(tiers[i])
        };
      }));
      data.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (page === "others") loadLeaderboard();
  }, [page]);

  const tierInfo = tier ? TIERS[tier] : null;

  function navigate(id) {
    setPage(id);
    setMenuOpen(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070908", color: "#e8dcc8", fontFamily: "'Rubik', sans-serif", fontWeight: 700 }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap'); * { font-family: 'Rubik', sans-serif !important; font-weight: 700 !important; }`}</style>

      <div style={{ background: "#0c0f0a", borderBottom: "1px solid #181e12", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div onClick={() => navigate("home")} style={{ fontSize: "1.4rem", color: "#00c4a0", cursor: "pointer" }}>🍄 AMANITA</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {account && <div style={{ fontSize: "0.75rem", color: "#00c4a0" }}>{account.slice(0,6)}...{account.slice(-4)}</div>}
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "1px solid #253018", color: "#e8dcc8", padding: "0.4rem 0.6rem", borderRadius: "4px", cursor: "pointer", fontSize: "1.1rem" }}>☰</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: "2.5rem", background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", minWidth: "200px", zIndex: 200 }}>
                {MENU_ITEMS.map(item => (
                  <div key={item.id} onClick={() => navigate(item.id)} style={{ padding: "0.75rem 1rem", cursor: "pointer", borderBottom: "1px solid #181e12", display: "flex", alignItems: "center", gap: "0.5rem", color: page === item.id ? "#00c4a0" : "#e8dcc8" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#181e12"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
                {account && (
                  <div onClick={() => { modal.disconnect(); setMenuOpen(false); setPage("home"); }} style={{ padding: "0.75rem 1rem", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#181e12"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span>🚪</span><span>Выйти</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>

        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem" }}>🍄</div>
              <h1 style={{ fontSize: "2rem", color: "#fff", margin: "0.5rem 0 1rem" }}>Amanita Network</h1>
            </div>

            {!account && (
              <div>
                <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ color: "#00c4a0", marginBottom: "1rem" }}>Как войти?</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>💻</span>
                      <div>
                        <div style={{ color: "#fff" }}>Через браузер</div>
                        <div style={{ color: "#b0a490", fontSize: "0.85rem" }}>Установите расширение MetaMask для Chrome, Edge или Firefox.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>📱</span>
                      <div>
                        <div style={{ color: "#fff" }}>Через телефон</div>
                        <div style={{ color: "#b0a490", fontSize: "0.85rem" }}>Установите MetaMask на телефон. Нажмите "Войти" — появится QR код для сканирования.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => modal.open()} style={{ background: "#00c4a0", color: "#070908", border: "none", padding: "1rem 2rem", borderRadius: "4px", cursor: "pointer", fontSize: "1.1rem" }}>
                    🦊 Войти
                  </button>
                </div>
              </div>
            )}

            {account && (
              <div>
                <div style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1.5rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "2.5rem" }}>{tierInfo?.icon || "🌱"}</div>
                    <div>
                      <div style={{ color: tierInfo?.color || "#6b7280", fontSize: "1.1rem" }}>{tierInfo?.name || "Зерно"}</div>
                      <div style={{ color: "#b0a490", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} токенов SHEVELEV</div>
                    </div>
                  </div>
                  {registered
                    ? <div style={{ color: "#00c4a0" }}>👋 Привет, {nickname}!</div>
                    : (
                      <div>
                        <p style={{ color: "#b0a490", marginBottom: "0.5rem" }}>Выберите ник:</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input value={inputNick} onChange={e => setInputNick(e.target.value)} placeholder="Ваш ник..." maxLength={32}
                            style={{ flex: 1, background: "#181e12", border: "1px solid #253018", color: "#e8dcc8", padding: "0.5rem", borderRadius: "4px" }} />
                          <button onClick={registerUser} disabled={loading}
                            style={{ background: "#00c4a0", color: "#070908", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
                            {loading ? "..." : "Войти"}
                          </button>
                        </div>
                      </div>
                    )
                  }
                </div>

                <div style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1.5rem" }}>
                  <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Рейтинг Amanita Network</h3>
                  {Object.entries(TIERS).reverse().map(([t, info]) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid #181e12" }}>
                      <span style={{ fontSize: "1.3rem" }}>{info.icon}</span>
                      <span style={{ color: info.color, width: "90px" }}>{info.name}</span>
                      <span style={{ color: "#b0a490", fontSize: "0.85rem" }}>от {info.min} токенов SHEVELEV</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {page === "profile" && (
          <div>
            <h2 style={{ color: "#fff" }}>👤 Моя страница</h2>
            {!account
              ? <div style={{ color: "#b0a490" }}>Подключите кошелёк для просмотра профиля.</div>
              : <div style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "3rem" }}>{tierInfo?.icon || "🌱"}</div>
                    <div>
                      <div style={{ color: "#fff", fontSize: "1.2rem" }}>{nickname || "Без ника"}</div>
                      <div style={{ color: tierInfo?.color || "#6b7280" }}>{tierInfo?.name || "Зерно"}</div>
                      <div style={{ color: "#b0a490", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} токенов SHEVELEV</div>
                    </div>
                  </div>
                  <div style={{ color: "#b0a490", fontSize: "0.8rem", wordBreak: "break-all" }}>{account}</div>
                </div>
            }
          </div>
        )}

        {page === "feed" && (
          <div>
            <h2 style={{ color: "#fff" }}>📝 Лента</h2>
            <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "2rem", textAlign: "center", color: "#b0a490" }}>
              🍄 Лента постов скоро появится...
            </div>
          </div>
        )}

        {page === "chats" && (
          <div>
            <h2 style={{ color: "#fff" }}>💬 Чаты</h2>
            <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "2rem", textAlign: "center", color: "#b0a490" }}>
              🍄 Чаты скоро появятся...
            </div>
          </div>
        )}

        {page === "create_chat" && (
          <div>
            <h2 style={{ color: "#fff" }}>➕ Создать чат</h2>
            <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "2rem", textAlign: "center", color: "#b0a490" }}>
              🍄 Создание чатов скоро появится...
            </div>
          </div>
        )}

        {page === "others" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1rem" }}>👥 Другие участники</h2>
            <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#00c4a0", marginBottom: "1rem" }}>Как попасть в рейтинг?</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  ["1.", "Установите MetaMask — расширение для браузера или приложение на телефон"],
                  ["2.", "Добавьте сеть Decimal Smart Chain — при входе на сайт это произойдёт автоматически"],
                  ["3.", "Получите токены SHEVELEV — чем больше токенов на кошельке, тем выше уровень"],
                  ["4.", "Импортируйте токен SHEVELEV в MetaMask по адресу: 0xb5c1933b1fa015818ac2c53812f67611c48e6b56"]
                ].map(([num, text]) => (
                  <div key={num} style={{ display: "flex", gap: "0.75rem" }}>
                    <span style={{ color: "#00c4a0" }}>{num}</span>
                    <div style={{ color: "#b0a490", fontSize: "0.9rem" }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
            {leaderboard.length === 0
              ? <div style={{ textAlign: "center", color: "#b0a490" }}>Загрузка...</div>
              : leaderboard.map((u, i) => (
                <div key={i} style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ color: "#b0a490", width: "30px", textAlign: "center" }}>#{i+1}</div>
                  <div style={{ fontSize: "1.5rem" }}>{TIERS[u.tier]?.icon || "🌱"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: TIERS[u.tier]?.color || "#6b7280" }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                    <div style={{ color: "#b0a490", fontSize: "0.8rem" }}>{parseFloat(u.balance).toLocaleString()} токенов SHEVELEV</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {page === "disclaimer" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1rem" }}>⚠️ Дисклеймер</h2>
            <div style={{ background: "#0c0f0a", border: "1px solid #253018", borderRadius: "4px", padding: "1.5rem", color: "#b0a490", lineHeight: "1.8" }}>
              <p>Amanita Network — открытая децентрализованная платформа для обмена личным опытом с Amanita muscaria исключительно в странах где это законно.</p>
              <p>Платформа не занимается продажей, рекламой или пропагандой каких-либо веществ.</p>
              <p>Перед любым использованием проконсультируйтесь с врачом.</p>
              <p style={{ color: "#ef4444" }}>⛔ Запрещено для лиц до 18 лет.</p>
            </div>
          </div>
        )}

      </div>

      <div style={{ textAlign: "center", padding: "1rem", color: "#253018", fontSize: "0.7rem", borderTop: "1px solid #181e12", marginTop: "2rem" }}>
        ⚠️ Только для легального личного опыта · Не реклама · Не продажа · Консультируйтесь с врачом
      </div>
    </div>
  );
}