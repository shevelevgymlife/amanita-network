import { useState, useEffect } from "react";
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { ethers } from "ethers";

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
    description: "Лес знает. Делись безопасно.",
    url: "https://amanita-network.onrender.com",
    icons: ["https://amanita-network.onrender.com/favicon.ico"]
  }
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
  1: { name: "Зерно", icon: "🌱", color: "#6b7280" },
  2: { name: "Участник", icon: "🍄", color: "#22c55e" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0" },
  4: { name: "Мастер", icon: "🔮", color: "#e879f9" },
  5: { name: "Легенда", icon: "⚜️", color: "#ffd700" }
};

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

  useEffect(() => {
    modal.subscribeAccount(async (acc) => {
      if (acc.address) {
        setAccount(acc.address);
        await loadUser(acc.address);
      } else {
        setAccount(null);
        setTier(null);
        setBalance(null);
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
      const [addrs, bals, nicks, , tiers] = await rep.getLeaderboardPage(0, 50);
      const data = addrs.map((a, i) => ({
        address: a,
        balance: ethers.formatEther(bals[i]),
        nickname: nicks[i],
        tier: Number(tiers[i])
      }));
      data.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (page === "leaderboard") loadLeaderboard();
  }, [page]);

  const tierInfo = tier ? TIERS[tier] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#070908", color: "#e8dcc8", fontFamily: "Georgia, serif" }}>
      {/* HEADER */}
      <div style={{ background: "#0c0f0a", borderBottom: "1px solid #181e12", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#00c4a0" }}>🍄 AMANITA</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setPage("home")} style={navBtn(page === "home")}>Главная</button>
          <button onClick={() => setPage("leaderboard")} style={navBtn(page === "leaderboard")}>Рейтинг</button>
        </div>
        {account
          ? <div style={{ fontSize: "0.75rem", color: "#00c4a0" }}>{account.slice(0,6)}...{account.slice(-4)}</div>
          : <button onClick={() => modal.open()} style={{ background: "#00c4a0", color: "#070908", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Подключить</button>
        }
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>

        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🍄</div>
              <h1 style={{ fontSize: "2rem", color: "#fff", margin: "0 0 0.5rem" }}>Amanita Network</h1>
              <p style={{ color: "#b0a490", fontStyle: "italic" }}>Лес знает. Делись безопасно.</p>
            </div>

            {!account && (
              <div style={{ textAlign: "center" }}>
                <button onClick={() => modal.open()} style={{ background: "#00c4a0", color: "#070908", border: "none", padding: "1rem 2rem", borderRadius: "4px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold" }}>
                  Войти через кошелёк
                </button>
                <p style={{ color: "#b0a490", fontSize: "0.85rem", marginTop: "1rem" }}>MetaMask, WalletConnect и другие кошельки</p>
              </div>
            )}

            {account && (
              <div>
                <div style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1.5rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "2.5rem" }}>{tierInfo?.icon || "🌱"}</div>
                    <div>
                      <div style={{ color: tierInfo?.color || "#6b7280", fontWeight: "bold", fontSize: "1.1rem" }}>{tierInfo?.name || "Зерно"}</div>
                      <div style={{ color: "#b0a490", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} SHEVELEV</div>
                    </div>
                  </div>

                  {registered
                    ? <div style={{ color: "#00c4a0" }}>👋 Привет, <strong>{nickname}</strong>!</div>
                    : (
                      <div>
                        <p style={{ color: "#b0a490", marginBottom: "0.5rem" }}>Выберите ник:</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            value={inputNick}
                            onChange={e => setInputNick(e.target.value)}
                            placeholder="Ваш ник..."
                            maxLength={32}
                            style={{ flex: 1, background: "#181e12", border: "1px solid #253018", color: "#e8dcc8", padding: "0.5rem", borderRadius: "4px" }}
                          />
                          <button onClick={registerUser} disabled={loading} style={{ background: "#00c4a0", color: "#070908", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                            {loading ? "..." : "Войти"}
                          </button>
                        </div>
                      </div>
                    )
                  }
                </div>

                <div style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1.5rem" }}>
                  <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Уровни SHEVELEV</h3>
                  {Object.entries(TIERS).reverse().map(([t, info]) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 0", borderBottom: "1px solid #181e12" }}>
                      <span style={{ fontSize: "1.3rem" }}>{info.icon}</span>
                      <span style={{ color: info.color, fontWeight: "bold", width: "80px" }}>{info.name}</span>
                      <span style={{ color: "#b0a490", fontSize: "0.85rem" }}>
                        {t == 5 ? "≥ 50,000" : t == 4 ? "≥ 10,000" : t == 3 ? "≥ 1,000" : t == 2 ? "≥ 100" : "0"} SHEVELEV
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {page === "leaderboard" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>🏆 Рейтинг держателей SHEVELEV</h2>
            {leaderboard.length === 0
              ? <div style={{ textAlign: "center", color: "#b0a490" }}>Загрузка...</div>
              : leaderboard.map((u, i) => (
                <div key={i} style={{ background: "#0c0f0a", border: "1px solid #181e12", borderRadius: "4px", padding: "1rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ color: "#b0a490", width: "30px", textAlign: "center" }}>#{i+1}</div>
                  <div style={{ fontSize: "1.5rem" }}>{TIERS[u.tier]?.icon || "🌱"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: TIERS[u.tier]?.color || "#6b7280", fontWeight: "bold" }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                    <div style={{ color: "#b0a490", fontSize: "0.8rem" }}>{parseFloat(u.balance).toLocaleString()} SHEVELEV</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "1rem", color: "#1c2614", fontSize: "0.7rem", borderTop: "1px solid #181e12" }}>
        ⚠️ Только для легального личного опыта · Не реклама · Не продажа · Консультируйтесь с врачом
      </div>
    </div>
  );
}

function navBtn(active) {
  return {
    background: active ? "rgba(0,196,160,0.1)" : "transparent",
    color: active ? "#00c4a0" : "#b0a490",
    border: "1px solid " + (active ? "#00c4a0" : "transparent"),
    padding: "0.3rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem"
  };
}