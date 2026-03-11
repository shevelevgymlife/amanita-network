import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

const API = process.env.REACT_APP_API_URL || "https://amanita-backend.onrender.com";
const projectId = process.env.REACT_APP_WC_PROJECT_ID;

const decimalChain = {
  id: 75, name: "Decimal Smart Chain", network: "decimal",
  nativeCurrency: { name: "DEL", symbol: "DEL", decimals: 18 },
  rpcUrls: { default: { http: ["https://node.decimalchain.com/web3/"] } },
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [decimalChain],
  defaultNetwork: decimalChain,
  metadata: { name: "Amanita Network", description: "Amanita Network", url: "https://amanita-network.onrender.com", icons: ["https://amanita-network.onrender.com/favicon.ico"] },
  features: { email: false, socials: false }
});

const REPUTATION_ADDRESS = "0xdb62AD6F2f4bb1c5D230aCeaCb937530746C5e13";
const SHEVELEV_ADDRESS = "0xb5c1933b1fa015818ac2c53812f67611c48e6b56";
const REPUTATION_ABI = ["function getTier(address) view returns (uint8)", "function isRegistered(address) view returns (bool)", "function userNickname(address) view returns (string)"];
const SHEVELEV_ABI = ["function balanceOf(address) view returns (uint256)"];

const TIERS = {
  1: { name: "Зерно", icon: "🌱", color: "#9ca3af", min: "0" },
  2: { name: "Участник", icon: "🍄", color: "#4ade80", min: "100" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0", min: "1,000" },
  4: { name: "Мастер", icon: "🔮", color: "#c084fc", min: "10,000" },
  5: { name: "Легенда", icon: "⚜️", color: "#fbbf24", min: "50,000" }
};

const MUSHROOMS = { red: "🍄 Красный мухомор", panther: "🟤 Пантерный мухомор", royal: "⚪ Королевский мухомор" };

const AVATARS = [
  { id: 0, emoji: "🧘", label: "Медитирующий" },
  { id: 1, emoji: "🌲", label: "Лесной житель" },
  { id: 2, emoji: "🦋", label: "Трансформация" },
  { id: 3, emoji: "🌙", label: "Ночной искатель" },
  { id: 4, emoji: "🔮", label: "Провидец" },
  { id: 5, emoji: "🌊", label: "Поток" },
  { id: 6, emoji: "🦅", label: "Орёл" },
  { id: 7, emoji: "🐺", label: "Волк" },
  { id: 8, emoji: "🌸", label: "Цветение" },
  { id: 9, emoji: "⚡", label: "Молния" },
  { id: 10, emoji: "🏔️", label: "Горный" },
  { id: 11, emoji: "🌿", label: "Травник" },
  { id: 12, emoji: "🔥", label: "Огонь" },
  { id: 13, emoji: "❄️", label: "Лёд" },
  { id: 14, emoji: "🌞", label: "Солнечный" },
  { id: 15, emoji: "🎭", label: "Маска" },
  { id: 16, emoji: "🧿", label: "Глаз" },
  { id: 17, emoji: "🕊️", label: "Голубь" },
  { id: 18, emoji: "🐉", label: "Дракон" },
  { id: 19, emoji: "🌀", label: "Спираль" },
];

const MENU_ITEMS = [
  { id: "profile", icon: "👤", label: "Моя страница" },
  { id: "feed", icon: "📝", label: "Лента" },
  { id: "chats", icon: "💬", label: "Чаты" },
  { id: "create_chat", icon: "➕", label: "Создать чат" },
  { id: "others", icon: "👥", label: "Другие" },
  { id: "disclaimer", icon: "⚠️", label: "Дисклеймер" },
];

const MUSHROOM_SVG = `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="45" ry="30" fill="white" opacity="0.03"/><ellipse cx="50" cy="52" rx="42" ry="28" fill="white" opacity="0.03"/><rect x="38" y="55" width="24" height="40" rx="6" fill="white" opacity="0.03"/><ellipse cx="35" cy="62" rx="6" ry="4" fill="white" opacity="0.04"/><ellipse cx="65" cy="58" rx="5" ry="3" fill="white" opacity="0.04"/><ellipse cx="50" cy="60" rx="4" ry="3" fill="white" opacity="0.04"/></svg>`;

const S = {
  page: { minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif", fontWeight: 500, position: "relative", overflow: "hidden" },
  header: { background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
  btn: { background: "linear-gradient(135deg, #00c4a0, #0099cc)", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Rubik', sans-serif" },
  btnSm: { background: "rgba(255,255,255,0.06)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)", padding: "0.4rem 0.9rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Rubik', sans-serif" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(10px)" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif" },
  textarea: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif", resize: "vertical", minHeight: "120px" },
  select: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif" },
};

export default function App() {
  const [account, setAccount] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", folder_id: null });
  const [showNewPost, setShowNewPost] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [profileForm, setProfileForm] = useState({ nickname: "", avatar_index: 0, gender: "", mushroom_type: "red", experience_days: 0, status: "" });

  useEffect(() => {
    modal.subscribeAccount(async (acc) => {
      if (acc.address) {
        setAccount(acc.address);
        await loadChainData(acc.address);
        await loadProfile(acc.address);
      } else {
        setAccount(null); setTier(null); setBalance(null); setProfile(null);
      }
    });
    loadTotalUsers();
    loadFeed();
  }, []);

  useEffect(() => {
    if (totalUsers === 0) return;
    let s = 0; const step = totalUsers / 60;
    const t = setInterval(() => { s += step; if (s >= totalUsers) { setDisplayCount(totalUsers); clearInterval(t); } else setDisplayCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [totalUsers]);

  async function loadChainData(addr) {
    try {
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const [t, bal] = await Promise.all([rep.getTier(addr), shev.balanceOf(addr)]);
      setTier(Number(t)); setBalance(ethers.formatEther(bal));
    } catch (e) { console.error(e); }
  }

  async function loadProfile(addr) {
    try {
      const r = await fetch(`${API}/api/users/${addr.toLowerCase()}`);
      const data = await r.json();
      setProfile(data);
      if (data) setProfileForm({ nickname: data.nickname || "", avatar_index: data.avatar_index || 0, gender: data.gender || "", mushroom_type: data.mushroom_type || "red", experience_days: data.experience_days || 0, status: data.status || "" });
      await loadFolders(addr);
      await loadPosts(addr);
    } catch (e) { console.error(e); }
  }

  async function loadTotalUsers() {
    try {
      const r = await fetch(`${API}/api/users`);
      const data = await r.json();
      setTotalUsers(data.length);
    } catch (e) { setTotalUsers(0); }
  }

  async function loadFeed() {
    try {
      const r = await fetch(`${API}/api/feed`);
      setFeed(await r.json());
    } catch (e) { console.error(e); }
  }

  async function loadFolders(addr) {
    try {
      const r = await fetch(`${API}/api/folders/${addr.toLowerCase()}`);
      setFolders(await r.json());
    } catch (e) { console.error(e); }
  }

  async function loadPosts(addr, folderId = null) {
    try {
      const url = folderId ? `${API}/api/posts/${addr.toLowerCase()}?folder_id=${folderId}` : `${API}/api/posts/${addr.toLowerCase()}`;
      const r = await fetch(url);
      setPosts(await r.json());
    } catch (e) { console.error(e); }
  }

  async function loadAllUsers() {
    try {
      const r = await fetch(`${API}/api/users`);
      setAllUsers(await r.json());
    } catch (e) { console.error(e); }
  }

  async function saveProfile() {
    try {
      await fetch(`${API}/api/users`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, ...profileForm }) });
      await loadProfile(account);
      setEditingProfile(false);
    } catch (e) { alert("Ошибка: " + e.message); }
  }

  async function createFolder() {
    if (!newFolderName) return;
    try {
      await fetch(`${API}/api/folders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, name: newFolderName }) });
      setNewFolderName(""); setShowNewFolder(false);
      await loadFolders(account);
    } catch (e) { alert("Ошибка: " + e.message); }
  }

  async function createPost() {
    if (!newPost.title || !newPost.content) return;
    try {
      await fetch(`${API}/api/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, ...newPost }) });
      setNewPost({ title: "", content: "", folder_id: null }); setShowNewPost(false);
      await loadPosts(account, selectedFolder);
      await loadTotalUsers();
    } catch (e) { alert("Ошибка: " + e.message); }
  }

  async function loadComments(postId) {
    try {
      const r = await fetch(`${API}/api/comments/${postId}`);
      setComments(prev => ({ ...prev, [postId]: await r.json() }));
    } catch (e) { console.error(e); }
  }

  async function submitComment(postId) {
    if (!newComment[postId] || !account) return;
    try {
      await fetch(`${API}/api/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id: postId, address: account, content: newComment[postId] }) });
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      await loadComments(postId);
    } catch (e) { alert("Ошибка: " + e.message); }
  }

  function navigate(id) { setPage(id); setMenuOpen(false); if (id === "others") loadAllUsers(); if (id === "feed") loadFeed(); }
  function daysOnPlatform(joinedAt) { return Math.floor((Date.now() - new Date(joinedAt)) / 86400000); }
  const tierInfo = tier ? TIERS[tier] : null;
  const avatar = AVATARS[profile?.avatar_index || 0];

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap'); *{box-sizing:border-box;} body{background:#0f1117;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#00c4a0;border-radius:2px;} .mi:hover{background:rgba(255,255,255,0.06)!important;} .ch:hover{border-color:rgba(0,196,160,0.3)!important;transform:translateY(-2px);transition:all 0.2s;}`}</style>

      {/* МУХОМОРЫ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[{top:"5%",left:"2%",size:180,r:-15},{top:"20%",right:"3%",size:140,r:10},{top:"50%",left:"1%",size:120,r:-5},{top:"70%",right:"5%",size:160,r:20},{top:"85%",left:"8%",size:100,r:-10},{top:"10%",left:"45%",size:90,r:5},{top:"60%",left:"50%",size:130,r:-20}].map((m,i)=>(
          <div key={i} style={{position:"absolute",top:m.top,left:m.left,right:m.right,width:m.size,height:m.size,transform:`rotate(${m.r}deg)`,opacity:0.4}} dangerouslySetInnerHTML={{__html:MUSHROOM_SVG}}/>
        ))}
      </div>

      {/* HEADER */}
      <div style={S.header}>
        <div onClick={()=>navigate("home")} style={{fontSize:"1.3rem",color:"#fff",cursor:"pointer"}}>
          🍄 <span style={{background:"linear-gradient(135deg,#00c4a0,#0099cc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AMANITA</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          {account && <div style={{fontSize:"0.75rem",color:"#00c4a0",background:"rgba(0,196,160,0.1)",padding:"0.3rem 0.8rem",borderRadius:"20px",border:"1px solid rgba(0,196,160,0.2)"}}>{account.slice(0,6)}...{account.slice(-4)}</div>}
          {!account && <button onClick={()=>modal.open()} style={S.btn}>🦊 Войти</button>}
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#e2e8f0",width:"40px",height:"40px",borderRadius:"8px",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
            {menuOpen&&(
              <div style={{position:"absolute",right:0,top:"3rem",background:"#1a1d27",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",minWidth:"220px",zIndex:200,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
                {MENU_ITEMS.map(item=>(
                  <div key={item.id} className="mi" onClick={()=>navigate(item.id)} style={{padding:"0.8rem 1.2rem",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:"0.75rem",color:page===item.id?"#00c4a0":"#e2e8f0",fontSize:"0.9rem"}}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
                {account&&<div className="mi" onClick={()=>{modal.disconnect();setMenuOpen(false);setPage("home");}} style={{padding:"0.8rem 1.2rem",cursor:"pointer",color:"#f87171",display:"flex",alignItems:"center",gap:"0.75rem",fontSize:"0.9rem"}}><span>🚪</span><span>Выйти</span></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:"900px",margin:"0 auto",padding:"2rem 1.5rem",position:"relative",zIndex:1}}>

        {/* ГЛАВНАЯ */}
        {page==="home"&&(
          <div>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div style={{fontSize:"4rem",marginBottom:"1rem",filter:"drop-shadow(0 0 30px rgba(0,196,160,0.3))"}}>🍄</div>
              <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,color:"#fff",letterSpacing:"-1px",lineHeight:1.1,marginBottom:"1rem"}}>
                Amanita<br/><span style={{background:"linear-gradient(135deg,#00c4a0,#0099cc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Network</span>
              </h1>
              <p style={{color:"#94a3b8",fontSize:"1.1rem",maxWidth:"400px",margin:"0 auto 2rem"}}>Открытая децентрализованная сеть для обмена опытом</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:"1.5rem",background:"rgba(0,196,160,0.08)",border:"1px solid rgba(0,196,160,0.2)",borderRadius:"16px",padding:"1.2rem 2.5rem",marginBottom:"2rem"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2.8rem",fontWeight:900,color:"#00c4a0",lineHeight:1}}>{displayCount}</div>
                  <div style={{fontSize:"0.8rem",color:"#64748b",marginTop:"0.3rem"}}>участников в сети</div>
                </div>
              </div>
              {!account&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem"}}>
                  <button onClick={()=>modal.open()} style={{...S.btn,padding:"0.9rem 2.5rem",fontSize:"1rem",borderRadius:"12px",boxShadow:"0 0 30px rgba(0,196,160,0.3)"}}>🦊 Войти через MetaMask</button>
                  <div style={{fontSize:"0.8rem",color:"#64748b"}}>Расширение для браузера или мобильное приложение</div>
                </div>
              )}
            </div>

            {account&&(
              <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                <div style={{...S.card,display:"flex",alignItems:"center",gap:"1.5rem"}} className="ch">
                  <div style={{fontSize:"3rem"}}>{AVATARS[profile?.avatar_index||0].emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{color:tierInfo?.color||"#9ca3af",fontSize:"1.1rem",fontWeight:700}}>{profile?.nickname||"Без ника"} · {tierInfo?.name||"Зерно"}</div>
                    <div style={{color:"#64748b",fontSize:"0.85rem"}}>{parseFloat(balance||0).toLocaleString()} токенов SHEVELEV</div>
                    {profile?.status&&<div style={{color:"#94a3b8",fontSize:"0.85rem",marginTop:"0.3rem"}}>"{profile.status}"</div>}
                  </div>
                  <button onClick={()=>navigate("profile")} style={S.btnSm}>Мой профиль</button>
                </div>

                <div style={S.card}>
                  <h3 style={{color:"#fff",marginBottom:"1rem",fontSize:"1rem"}}>Рейтинг Amanita Network</h3>
                  {Object.entries(TIERS).reverse().map(([t,info])=>(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.75rem 1rem",background:"rgba(255,255,255,0.02)",borderRadius:"8px",marginBottom:"0.4rem",border:`1px solid ${Number(t)===tier?info.color+"40":"transparent"}`}}>
                      <span style={{fontSize:"1.3rem"}}>{info.icon}</span>
                      <span style={{color:info.color,width:"90px",fontSize:"0.9rem"}}>{info.name}</span>
                      <span style={{color:"#64748b",fontSize:"0.85rem"}}>от {info.min} токенов SHEVELEV</span>
                      {Number(t)===tier&&<span style={{marginLeft:"auto",fontSize:"0.75rem",color:info.color,background:info.color+"20",padding:"0.2rem 0.6rem",borderRadius:"20px"}}>Ваш уровень</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!account&&(
              <div style={{...S.card,marginTop:"2rem"}}>
                <h3 style={{color:"#00c4a0",marginBottom:"1rem",fontSize:"0.95rem"}}>Как войти?</h3>
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  <div style={{display:"flex",gap:"1rem"}}><span style={{fontSize:"1.5rem"}}>💻</span><div><div style={{color:"#fff",fontSize:"0.9rem"}}>Через браузер</div><div style={{color:"#64748b",fontSize:"0.85rem"}}>Установите расширение MetaMask для Chrome, Edge или Firefox.</div></div></div>
                  <div style={{display:"flex",gap:"1rem"}}><span style={{fontSize:"1.5rem"}}>📱</span><div><div style={{color:"#fff",fontSize:"0.9rem"}}>Через телефон</div><div style={{color:"#64748b",fontSize:"0.85rem"}}>Установите приложение MetaMask. Откройте сайт через браузер внутри MetaMask.</div></div></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* МОЯ СТРАНИЦА */}
        {page==="profile"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>👤 Моя страница</h2>
            {!account
              ? <div style={{...S.card,textAlign:"center",color:"#64748b",padding:"3rem"}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔒</div><p>Подключите кошелёк</p><button onClick={()=>modal.open()} style={{...S.btn,marginTop:"1rem"}}>🦊 Войти</button></div>
              : <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>

                  {/* ПРОФИЛЬ КАРТОЧКА */}
                  <div style={S.card}>
                    <div style={{display:"flex",gap:"1.5rem",alignItems:"flex-start",flexWrap:"wrap"}}>
                      <div style={{width:"80px",height:"80px",borderRadius:"50%",background:`linear-gradient(135deg,${tierInfo?.color||"#9ca3af"}33,#0f1117)`,border:`2px solid ${tierInfo?.color||"#9ca3af"}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",flexShrink:0}}>
                        {AVATARS[profile?.avatar_index||0].emoji}
                      </div>
                      <div style={{flex:1,minWidth:"200px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>
                          <span style={{color:"#fff",fontSize:"1.3rem",fontWeight:700}}>{profile?.nickname||"Без ника"}</span>
                          <span style={{color:tierInfo?.color||"#9ca3af",background:(tierInfo?.color||"#9ca3af")+"20",padding:"0.2rem 0.6rem",borderRadius:"20px",fontSize:"0.8rem"}}>{tierInfo?.icon} {tierInfo?.name||"Зерно"}</span>
                          {profile?.gender&&<span style={{color:"#64748b",fontSize:"0.85rem"}}>{profile.gender==="male"?"♂️ Мужчина":"♀️ Женщина"}</span>}
                        </div>
                        {profile?.status&&<div style={{color:"#94a3b8",fontSize:"0.9rem",fontStyle:"italic",marginBottom:"0.5rem"}}>"{profile.status}"</div>}
                        <div style={{display:"flex",flexWrap:"wrap",gap:"1rem",fontSize:"0.85rem",color:"#64748b"}}>
                          <span>🍄 {MUSHROOMS[profile?.mushroom_type||"red"]}</span>
                          <span>📅 Стаж: {profile?.experience_days||0} дней</span>
                          <span>🗓 На платформе: {profile ? daysOnPlatform(profile.joined_at) : 0} дней</span>
                          <span>📝 Постов: {profile?.post_count||0}</span>
                        </div>
                        <div style={{marginTop:"0.5rem",color:"#64748b",fontSize:"0.8rem"}}>{parseFloat(balance||0).toLocaleString()} токенов SHEVELEV</div>
                      </div>
                      <button onClick={()=>setEditingProfile(!editingProfile)} style={S.btnSm}>{editingProfile?"Отмена":"✏️ Редактировать"}</button>
                    </div>

                    {/* ФОРМА РЕДАКТИРОВАНИЯ */}
                    {editingProfile&&(
                      <div style={{marginTop:"1.5rem",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"1.5rem"}}>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1rem"}}>
                          <div>
                            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.4rem"}}>Ник</label>
                            <input value={profileForm.nickname} onChange={e=>setProfileForm({...profileForm,nickname:e.target.value})} style={S.input} placeholder="Ваш ник..." maxLength={32}/>
                          </div>
                          <div>
                            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.4rem"}}>Статус</label>
                            <input value={profileForm.status} onChange={e=>setProfileForm({...profileForm,status:e.target.value})} style={S.input} placeholder="Ваш статус..." maxLength={100}/>
                          </div>
                          <div>
                            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.4rem"}}>Пол</label>
                            <select value={profileForm.gender} onChange={e=>setProfileForm({...profileForm,gender:e.target.value})} style={S.select}>
                              <option value="">Не указан</option>
                              <option value="male">♂️ Мужчина</option>
                              <option value="female">♀️ Женщина</option>
                            </select>
                          </div>
                          <div>
                            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.4rem"}}>Любимый мухомор</label>
                            <select value={profileForm.mushroom_type} onChange={e=>setProfileForm({...profileForm,mushroom_type:e.target.value})} style={S.select}>
                              <option value="red">🍄 Красный мухомор</option>
                              <option value="panther">🟤 Пантерный мухомор</option>
                              <option value="royal">⚪ Королевский мухомор</option>
                            </select>
                          </div>
                          <div>
                            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.4rem"}}>Стаж приёма (дней)</label>
                            <input type="number" value={profileForm.experience_days} onChange={e=>setProfileForm({...profileForm,experience_days:parseInt(e.target.value)||0})} style={S.input} min="0"/>
                          </div>
                        </div>
                        <div style={{marginBottom:"1rem"}}>
                          <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:"0.75rem"}}>Аватар</label>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(70px,1fr))",gap:"0.5rem"}}>
                            {AVATARS.map(av=>(
                              <div key={av.id} onClick={()=>setProfileForm({...profileForm,avatar_index:av.id})} style={{background:profileForm.avatar_index===av.id?"rgba(0,196,160,0.2)":"rgba(255,255,255,0.04)",border:`1px solid ${profileForm.avatar_index===av.id?"#00c4a0":"rgba(255,255,255,0.08)"}`,borderRadius:"8px",padding:"0.5rem",textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}>
                                <div style={{fontSize:"1.8rem"}}>{av.emoji}</div>
                                <div style={{fontSize:"0.6rem",color:"#64748b",marginTop:"0.2rem"}}>{av.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={saveProfile} style={S.btn}>Сохранить профиль</button>
                      </div>
                    )}
                  </div>

                  {/* ПАПКИ И ПОСТЫ */}
                  <div style={S.card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
                      <h3 style={{color:"#fff",fontSize:"1rem"}}>📁 Папки и посты</h3>
                      <div style={{display:"flex",gap:"0.5rem"}}>
                        <button onClick={()=>setShowNewFolder(!showNewFolder)} style={S.btnSm}>+ Папка</button>
                        <button onClick={()=>setShowNewPost(!showNewPost)} style={S.btn}>+ Пост</button>
                      </div>
                    </div>

                    {showNewFolder&&(
                      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem"}}>
                        <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="Название папки..." style={S.input}/>
                        <button onClick={createFolder} style={S.btn}>Создать</button>
                      </div>
                    )}

                    {/* СПИСОК ПАПОК */}
                    <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"}}>
                      <button onClick={()=>{setSelectedFolder(null);loadPosts(account);}} style={{...S.btnSm,borderColor:!selectedFolder?"#00c4a0":"rgba(255,255,255,0.1)",color:!selectedFolder?"#00c4a0":"#e2e8f0"}}>Все посты</button>
                      {folders.map(f=>(
                        <button key={f.id} onClick={()=>{setSelectedFolder(f.id);loadPosts(account,f.id);}} style={{...S.btnSm,borderColor:selectedFolder===f.id?"#00c4a0":"rgba(255,255,255,0.1)",color:selectedFolder===f.id?"#00c4a0":"#e2e8f0"}}>📁 {f.name}</button>
                      ))}
                    </div>

                    {showNewPost&&(
                      <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"12px",padding:"1rem",marginBottom:"1rem",border:"1px solid rgba(255,255,255,0.08)"}}>
                        <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} placeholder="Название поста..." style={{...S.input,marginBottom:"0.75rem"}} maxLength={200}/>
                        <textarea value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})} placeholder="Текст поста..." style={S.textarea} maxLength={5000}/>
                        <div style={{display:"flex",gap:"0.75rem",marginTop:"0.75rem",flexWrap:"wrap"}}>
                          <select value={newPost.folder_id||""} onChange={e=>setNewPost({...newPost,folder_id:e.target.value||null})} style={{...S.select,width:"auto",flex:1}}>
                            <option value="">Без папки</option>
                            {folders.map(f=><option key={f.id} value={f.id}>📁 {f.name}</option>)}
                          </select>
                          <button onClick={createPost} style={S.btn}>Опубликовать</button>
                        </div>
                      </div>
                    )}

                    {/* СПИСОК ПОСТОВ */}
                    {posts.length===0
                      ? <div style={{textAlign:"center",color:"#64748b",padding:"2rem"}}>Постов пока нет. Напишите первый!</div>
                      : posts.map(post=>(
                        <div key={post.id} style={{background:"rgba(255,255,255,0.02)",borderRadius:"12px",padding:"1rem",marginBottom:"0.75rem",border:"1px solid rgba(255,255,255,0.06)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem",flexWrap:"wrap",gap:"0.5rem"}}>
                            <div style={{color:"#fff",fontWeight:700}}>{post.title}</div>
                            <div style={{fontSize:"0.75rem",color:"#64748b"}}>{new Date(post.created_at).toLocaleDateString("ru-RU")}{post.folder_name&&<span style={{marginLeft:"0.5rem",color:"#00c4a0"}}>📁 {post.folder_name}</span>}</div>
                          </div>
                          <div style={{color:"#94a3b8",fontSize:"0.9rem",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{post.content}</div>
                          <div style={{marginTop:"0.75rem"}}>
                            <button onClick={()=>loadComments(post.id)} style={{...S.btnSm,fontSize:"0.8rem"}}>💬 {post.comment_count} комментариев</button>
                          </div>
                          {comments[post.id]&&(
                            <div style={{marginTop:"0.75rem"}}>
                              {comments[post.id].map(c=>(
                                <div key={c.id} style={{background:"rgba(255,255,255,0.03)",borderRadius:"8px",padding:"0.75rem",marginBottom:"0.5rem"}}>
                                  <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.3rem"}}>
                                    <span style={{fontSize:"1.1rem"}}>{AVATARS[c.avatar_index||0].emoji}</span>
                                    <span style={{color:"#00c4a0",fontSize:"0.85rem",fontWeight:700}}>{c.nickname||c.address.slice(0,8)+"..."}</span>
                                    <span style={{color:"#64748b",fontSize:"0.75rem"}}>{new Date(c.created_at).toLocaleDateString("ru-RU")}</span>
                                  </div>
                                  <div style={{color:"#94a3b8",fontSize:"0.85rem"}}>{c.content}</div>
                                </div>
                              ))}
                              <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                                <input value={newComment[post.id]||""} onChange={e=>setNewComment(prev=>({...prev,[post.id]:e.target.value}))} placeholder="Ваш комментарий..." style={{...S.input,fontSize:"0.85rem"}}/>
                                <button onClick={()=>submitComment(post.id)} style={S.btn}>→</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
            }
          </div>
        )}

        {/* ЛЕНТА */}
        {page==="feed"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>📝 Лента</h2>
            {feed.length===0
              ? <div style={{...S.card,textAlign:"center",color:"#64748b",padding:"3rem"}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🍄</div><p>Постов пока нет...</p></div>
              : feed.map(post=>(
                <div key={post.id} style={{...S.card,marginBottom:"1rem"}} className="ch">
                  <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
                    <span style={{fontSize:"1.5rem"}}>{AVATARS[post.avatar_index||0].emoji}</span>
                    <div>
                      <div style={{color:"#00c4a0",fontWeight:700,fontSize:"0.9rem"}}>{post.nickname||post.address.slice(0,8)+"..."}</div>
                      <div style={{color:"#64748b",fontSize:"0.75rem"}}>{new Date(post.created_at).toLocaleDateString("ru-RU")}</div>
                    </div>
                  </div>
                  <div style={{color:"#fff",fontWeight:700,marginBottom:"0.5rem"}}>{post.title}</div>
                  <div style={{color:"#94a3b8",fontSize:"0.9rem",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{post.content}</div>
                  <div style={{marginTop:"0.75rem"}}>
                    <button onClick={()=>loadComments(post.id)} style={{...S.btnSm,fontSize:"0.8rem"}}>💬 {post.comment_count} комментариев</button>
                  </div>
                  {comments[post.id]&&(
                    <div style={{marginTop:"0.75rem"}}>
                      {comments[post.id].map(c=>(
                        <div key={c.id} style={{background:"rgba(255,255,255,0.03)",borderRadius:"8px",padding:"0.75rem",marginBottom:"0.5rem"}}>
                          <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.3rem"}}>
                            <span style={{fontSize:"1.1rem"}}>{AVATARS[c.avatar_index||0].emoji}</span>
                            <span style={{color:"#00c4a0",fontSize:"0.85rem",fontWeight:700}}>{c.nickname||c.address.slice(0,8)+"..."}</span>
                          </div>
                          <div style={{color:"#94a3b8",fontSize:"0.85rem"}}>{c.content}</div>
                        </div>
                      ))}
                      {account&&(
                        <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                          <input value={newComment[post.id]||""} onChange={e=>setNewComment(prev=>({...prev,[post.id]:e.target.value}))} placeholder="Ваш комментарий..." style={{...S.input,fontSize:"0.85rem"}}/>
                          <button onClick={()=>submitComment(post.id)} style={S.btn}>→</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {/* ЧАТЫ */}
        {page==="chats"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>💬 Чаты</h2>
            <div style={{...S.card,textAlign:"center",color:"#64748b",padding:"3rem"}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🍄</div><p>Чаты скоро появятся...</p></div>
          </div>
        )}

        {page==="create_chat"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>➕ Создать чат</h2>
            <div style={{...S.card,textAlign:"center",color:"#64748b",padding:"3rem"}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🍄</div><p>Создание чатов скоро появится...</p></div>
          </div>
        )}

        {/* ДРУГИЕ */}
        {page==="others"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>👥 Другие участники</h2>
            <div style={{...S.card,marginBottom:"1.5rem"}}>
              <h3 style={{color:"#00c4a0",marginBottom:"1rem",fontSize:"0.95rem"}}>Как попасть в рейтинг?</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                {[["1","Установите MetaMask — расширение для браузера или приложение на телефон"],["2","Добавьте сеть Decimal Smart Chain — при входе на сайт это произойдёт автоматически"],["3","Получите токены SHEVELEV — чем больше токенов на кошельке, тем выше уровень"],["4","Импортируйте токен SHEVELEV в MetaMask: 0xb5c1933b1fa015818ac2c53812f67611c48e6b56"]].map(([n,t])=>(
                  <div key={n} style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
                    <span style={{color:"#00c4a0",background:"rgba(0,196,160,0.1)",width:"24px",height:"24px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",flexShrink:0}}>{n}</span>
                    <span style={{color:"#94a3b8",fontSize:"0.9rem",lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {allUsers.length===0
              ? <div style={{textAlign:"center",color:"#64748b",padding:"2rem"}}>Загрузка...</div>
              : allUsers.map((u,i)=>(
                <div key={u.address} style={{...S.card,marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"1rem"}} className="ch">
                  <div style={{color:"#64748b",width:"30px",textAlign:"center",fontSize:"0.85rem"}}>#{i+1}</div>
                  <div style={{fontSize:"1.5rem"}}>{AVATARS[u.avatar_index||0].emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{color:"#00c4a0",fontWeight:700}}>{u.nickname||u.address.slice(0,8)+"..."}</div>
                    <div style={{color:"#64748b",fontSize:"0.8rem"}}>📝 {u.post_count||0} постов · 🗓 {daysOnPlatform(u.joined_at)} дней на платформе</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ДИСКЛЕЙМЕР */}
        {page==="disclaimer"&&(
          <div>
            <h2 style={{color:"#fff",marginBottom:"1.5rem",fontWeight:900}}>⚠️ Дисклеймер</h2>
            <div style={{...S.card,lineHeight:1.8}}>
              <p style={{color:"#94a3b8",marginBottom:"1rem"}}>Amanita Network — открытая децентрализованная платформа для обмена личным опытом с Amanita muscaria исключительно в странах где это законно.</p>
              <p style={{color:"#94a3b8",marginBottom:"1rem"}}>Платформа не занимается продажей, рекламой или пропагандой каких-либо веществ.</p>
              <p style={{color:"#94a3b8",marginBottom:"1rem"}}>Перед любым использованием проконсультируйтесь с врачом.</p>
              <p style={{color:"#f87171",fontWeight:700}}>⛔ Запрещено для лиц до 18 лет.</p>
            </div>
          </div>
        )}

      </div>

      <div style={{textAlign:"center",padding:"1.5rem",color:"#334155",fontSize:"0.75rem",borderTop:"1px solid rgba(255,255,255,0.04)",position:"relative",zIndex:1}}>
        ⚠️ Только для легального личного опыта · Не реклама · Не продажа · Консультируйтесь с врачом
      </div>
    </div>
  );
}