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
const REPUTATION_ABI = ["function getTier(address) view returns (uint8)"];
const SHEVELEV_ABI = ["function balanceOf(address) view returns (uint256)"];

const TIERS = {
  1: { name: "Зерно", icon: "🌱", color: "#9ca3af" },
  2: { name: "Участник", icon: "🍄", color: "#4ade80" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0" },
  4: { name: "Мастер", icon: "🔮", color: "#c084fc" },
  5: { name: "Легенда", icon: "⚜️", color: "#fbbf24" }
};

const MUSHROOMS = { red: "🍄 Красный", panther: "🟤 Пантерный", royal: "⚪ Королевский" };

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
  { id: "others", icon: "👥", label: "Другие" },
  { id: "disclaimer", icon: "⚠️", label: "Дисклеймер" },
];

const MUSHROOM_SVG = `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="45" ry="30" fill="white" opacity="0.03"/><ellipse cx="50" cy="52" rx="42" ry="28" fill="white" opacity="0.03"/><rect x="38" y="55" width="24" height="40" rx="6" fill="white" opacity="0.03"/><ellipse cx="35" cy="62" rx="6" ry="4" fill="white" opacity="0.04"/><ellipse cx="65" cy="58" rx="5" ry="3" fill="white" opacity="0.04"/><ellipse cx="50" cy="60" rx="4" ry="3" fill="white" opacity="0.04"/></svg>`;

const S = {
  page: { minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif", fontWeight: 500, position: "relative" },
  header: { background: "rgba(15,17,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
  btn: { background: "linear-gradient(135deg, #00c4a0, #0099cc)", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Rubik', sans-serif" },
  btnSm: { background: "rgba(255,255,255,0.06)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)", padding: "0.4rem 0.9rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Rubik', sans-serif" },
  btnDanger: { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", padding: "0.4rem 0.9rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Rubik', sans-serif" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif" },
  textarea: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif", resize: "vertical", minHeight: "100px" },
  select: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", padding: "0.7rem 1rem", borderRadius: "8px", width: "100%", fontSize: "0.9rem", outline: "none", fontFamily: "'Rubik', sans-serif" },
};

function daysAgo(date) { return Math.floor((Date.now() - new Date(date)) / 86400000); }
function formatDate(date) { return new Date(date).toLocaleDateString("ru-RU"); }

function PostCard({ post, account, onReload, isOwner }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, content: post.content });
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [myLike, setMyLike] = useState(null);
  const [likes, setLikes] = useState(post.like_count || 0);
  const [dislikes, setDislikes] = useState(post.dislike_count || 0);

  async function loadComments() {
    const r = await fetch(`${API}/api/comments/${post.id}`);
    const data = await r.json();
    setComments(data);
  }

  async function toggleComments() {
    if (!showComments) await loadComments();
    setShowComments(!showComments);
  }

  async function submitComment() {
    if (!newComment || !account) return;
    await fetch(`${API}/api/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id: post.id, parent_id: replyTo?.id || null, address: account, content: replyTo ? `@${replyTo.nickname || replyTo.address?.slice(0,8)} ${newComment}` : newComment }) });
    setNewComment(""); setReplyTo(null);
    await loadComments();
  }

  async function deleteComment(cId) {
    await fetch(`${API}/api/comments/${cId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, post_owner: post.address }) });
    await loadComments();
  }

  async function saveEditComment(cId) {
    await fetch(`${API}/api/comments/${cId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, content: editCommentText }) });
    setEditingComment(null);
    await loadComments();
  }

  async function savePost() {
    await fetch(`${API}/api/posts/${post.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, ...editData }) });
    setEditing(false);
    onReload();
  }

  async function deletePost() {
    if (!window.confirm("Удалить пост?")) return;
    await fetch(`${API}/api/posts/${post.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account }) });
    onReload();
  }

  async function handleLike(type) {
    if (!account) return;
    const prev = myLike;
    if (prev === type) {
      setMyLike(null);
      if (type === "like") setLikes(l => l - 1);
      else setDislikes(d => d - 1);
    } else {
      if (prev === "like") setLikes(l => l - 1);
      if (prev === "dislike") setDislikes(d => d - 1);
      setMyLike(type);
      if (type === "like") setLikes(l => l + 1);
      else setDislikes(d => d + 1);
    }
    await fetch(`${API}/api/post-likes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, post_id: post.id, type }) });
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", marginBottom: "0.75rem", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.3rem" }}>{AVATARS[post.avatar_index || 0]?.emoji}</span>
        <div style={{ flex: 1 }}>
          <span style={{ color: "#00c4a0", fontWeight: 700, fontSize: "0.85rem" }}>{post.nickname || post.address?.slice(0,8)+"..."}</span>
          <span style={{ color: "#64748b", fontSize: "0.75rem", marginLeft: "0.5rem" }}>{formatDate(post.created_at)}</span>
          {post.folder_name && <span style={{ color: "#00c4a0", fontSize: "0.75rem", marginLeft: "0.5rem" }}>📁 {post.folder_name}</span>}
        </div>
        {isOwner && !editing && (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button onClick={() => setEditing(true)} style={S.btnSm}>✏️</button>
            <button onClick={deletePost} style={S.btnDanger}>🗑️</button>
          </div>
        )}
      </div>

      {editing ? (
        <div>
          <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} style={{ ...S.input, marginBottom: "0.5rem" }} />
          <textarea value={editData.content} onChange={e => setEditData({ ...editData, content: e.target.value })} style={{ ...S.textarea, marginBottom: "0.5rem" }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={savePost} style={S.btn}>Сохранить</button>
            <button onClick={() => setEditing(false)} style={S.btnSm}>Отмена</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ color: "#fff", fontWeight: 700, marginBottom: "0.4rem" }}>{post.title}</div>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{post.content}</div>
        </>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <button onClick={() => handleLike("like")} style={{ ...S.btnSm, color: myLike === "like" ? "#4ade80" : "#e2e8f0", borderColor: myLike === "like" ? "#4ade80" : "rgba(255,255,255,0.1)" }}>👍 {likes}</button>
        <button onClick={() => handleLike("dislike")} style={{ ...S.btnSm, color: myLike === "dislike" ? "#f87171" : "#e2e8f0", borderColor: myLike === "dislike" ? "#f87171" : "rgba(255,255,255,0.1)" }}>👎 {dislikes}</button>
        <button onClick={toggleComments} style={S.btnSm}>💬 {post.comment_count || 0}</button>
      </div>

      {showComments && (
        <div style={{ marginTop: "0.75rem" }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.5rem", borderLeft: c.parent_id ? "2px solid #00c4a0" : "none", marginLeft: c.parent_id ? "1rem" : "0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                <span>{AVATARS[c.avatar_index || 0]?.emoji}</span>
                <span style={{ color: "#00c4a0", fontSize: "0.85rem", fontWeight: 700 }}>{c.nickname || c.address?.slice(0,8)+"..."}</span>
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{formatDate(c.created_at)}</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem" }}>
                  <button onClick={() => setReplyTo(c)} style={{ ...S.btnSm, fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>↩️</button>
                  {(account === c.address || isOwner) && (
                    <>
                      {account === c.address && <button onClick={() => { setEditingComment(c.id); setEditCommentText(c.content); }} style={{ ...S.btnSm, fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>✏️</button>}
                      <button onClick={() => deleteComment(c.id)} style={{ ...S.btnDanger, fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>🗑️</button>
                    </>
                  )}
                </div>
              </div>
              {editingComment === c.id ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input value={editCommentText} onChange={e => setEditCommentText(e.target.value)} style={{ ...S.input, fontSize: "0.85rem" }} />
                  <button onClick={() => saveEditComment(c.id)} style={S.btn}>✓</button>
                  <button onClick={() => setEditingComment(null)} style={S.btnSm}>✕</button>
                </div>
              ) : (
                <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{c.content}</div>
              )}
            </div>
          ))}
          {account && (
            <div>
              {replyTo && (
                <div style={{ color: "#00c4a0", fontSize: "0.8rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  ↩️ Ответ для {replyTo.nickname || replyTo.address?.slice(0,8)+"..."}
                  <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Комментарий..." style={{ ...S.input, fontSize: "0.85rem" }} onKeyDown={e => e.key === "Enter" && submitComment()} />
                <button onClick={submitComment} style={S.btn}>→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserPage({ address, account, myVotes, onVote, onBack }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => { loadData(); }, [address]);

  async function loadData() {
    try {
      const [ur, pr, fr] = await Promise.all([
        fetch(`${API}/api/users/${address}`).then(r => r.json()),
        fetch(`${API}/api/posts/${address}`).then(r => r.json()),
        fetch(`${API}/api/folders/${address}`).then(r => r.json()),
      ]);
      setUser(ur); setPosts(pr); setFolders(fr);
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const rep = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const [t, bal] = await Promise.all([rep.getTier(address), shev.balanceOf(address)]);
      setTier(Number(t)); setBalance(ethers.formatEther(bal));
    } catch (e) { console.error(e); }
  }

  async function loadPostsByFolder(fId) {
    setSelectedFolder(fId);
    const url = fId ? `${API}/api/posts/${address}?folder_id=${fId}` : `${API}/api/posts/${address}`;
    const r = await fetch(url);
    setPosts(await r.json());
  }

  const tierInfo = tier ? TIERS[tier] : null;
  const hasVoted = myVotes.includes(address.toLowerCase());
  const isMe = account?.toLowerCase() === address.toLowerCase();

  if (!user) return <div style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>Загрузка...</div>;

  return (
    <div>
      <button onClick={onBack} style={{ ...S.btnSm, marginBottom: "1rem" }}>← Назад</button>
      <div style={S.card}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg,${tierInfo?.color || "#9ca3af"}33,#0f1117)`, border: `2px solid ${tierInfo?.color || "#9ca3af"}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>
            {AVATARS[user.avatar_index || 0]?.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <span style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{user.nickname || address.slice(0,8)+"..."}</span>
              <span style={{ color: tierInfo?.color || "#9ca3af", background: (tierInfo?.color || "#9ca3af") + "20", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.8rem" }}>{tierInfo?.icon} {tierInfo?.name || "Зерно"}</span>
            </div>
            {user.status && <div style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: "0.5rem" }}>"{user.status}"</div>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
              <span>{MUSHROOMS[user.mushroom_type || "red"]}</span>
              <span>📅 Стаж: {user.experience_days || 0} дней</span>
              <span>🗓 {daysAgo(user.joined_at)} дней на платформе</span>
              <span>📝 {user.post_count || 0} постов</span>
              <span>⭐ {user.vote_count || 0} голосов</span>
            </div>
            <div style={{ marginTop: "0.5rem", color: "#64748b", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} SHEVELEV</div>
          </div>
          {!isMe && account && (
            <button onClick={() => onVote(address, hasVoted)} style={{ ...S.btnSm, borderColor: hasVoted ? "#fbbf24" : "rgba(255,255,255,0.1)", color: hasVoted ? "#fbbf24" : "#e2e8f0" }}>
              {hasVoted ? "⭐ Голос дан" : "⭐ Голосовать"}
            </button>
          )}
        </div>
      </div>
      <div style={{ ...S.card, marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={() => loadPostsByFolder(null)} style={{ ...S.btnSm, borderColor: !selectedFolder ? "#00c4a0" : "rgba(255,255,255,0.1)", color: !selectedFolder ? "#00c4a0" : "#e2e8f0" }}>Все</button>
          {folders.map(f => (
            <button key={f.id} onClick={() => loadPostsByFolder(f.id)} style={{ ...S.btnSm, borderColor: selectedFolder === f.id ? "#00c4a0" : "rgba(255,255,255,0.1)", color: selectedFolder === f.id ? "#00c4a0" : "#e2e8f0" }}>📁 {f.name}</button>
          ))}
        </div>
        {posts.length === 0
          ? <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Постов пока нет</div>
          : posts.map(post => <PostCard key={post.id} post={{ ...post, nickname: user.nickname, avatar_index: user.avatar_index }} account={account} onReload={() => loadPostsByFolder(selectedFolder)} isOwner={isMe} />)
        }
      </div>
    </div>
  );
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", folder_id: null });
  const [showNewPost, setShowNewPost] = useState(false);
  const [profileForm, setProfileForm] = useState({ nickname: "", avatar_index: 0, gender: "", mushroom_type: "red", experience_days: 0, status: "" });
  const [myVotes, setMyVotes] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [topByTokens, setTopByTokens] = useState([]);
  const [topByVotes, setTopByVotes] = useState([]);

  useEffect(() => {
    modal.subscribeAccount(async (acc) => {
      if (acc.address) {
        setAccount(acc.address);
        await loadChainData(acc.address);
        await loadProfile(acc.address);
        await loadMyVotes(acc.address);
      } else {
        setAccount(null); setTier(null); setBalance(null); setProfile(null); setMyVotes([]);
      }
    });
    loadTotalUsers();
    loadFeed();
    loadRatings();
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

  async function loadMyVotes(addr) {
    try {
      const r = await fetch(`${API}/api/votes/${addr.toLowerCase()}`);
      setMyVotes(await r.json());
    } catch (e) { console.error(e); }
  }

  async function loadTotalUsers() {
    try {
      const r = await fetch(`${API}/api/users`);
      const data = await r.json();
      setTotalUsers(data.length);
    } catch (e) { setTotalUsers(0); }
  }

  async function loadRatings() {
    try {
      const r = await fetch(`${API}/api/users`);
      const users = await r.json();

      // Топ по голосам
      const byVotes = [...users].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0)).slice(0, 5);
      setTopByVotes(byVotes);

      // Топ по токенам — загружаем балансы
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const withBalances = await Promise.all(users.map(async u => {
        try {
          const bal = await shev.balanceOf(u.address);
          return { ...u, shevelev: parseFloat(ethers.formatEther(bal)) };
        } catch { return { ...u, shevelev: 0 }; }
      }));
      const byTokens = [...withBalances].sort((a, b) => b.shevelev - a.shevelev).slice(0, 5);
      setTopByTokens(byTokens);
    } catch (e) { console.error(e); }
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
    await fetch(`${API}/api/folders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, name: newFolderName }) });
    setNewFolderName(""); setShowNewFolder(false);
    await loadFolders(account);
  }

  async function renameFolder(id, name) {
    await fetch(`${API}/api/folders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, name }) });
    setEditingFolder(null);
    await loadFolders(account);
  }

  async function deleteFolder(id) {
    if (!window.confirm("Удалить папку? Посты останутся.")) return;
    await fetch(`${API}/api/folders/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account }) });
    setSelectedFolder(null);
    await loadFolders(account);
    await loadPosts(account);
  }

  async function createPost() {
    if (!newPost.title || !newPost.content) return;
    await fetch(`${API}/api/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, ...newPost }) });
    setNewPost({ title: "", content: "", folder_id: null }); setShowNewPost(false);
    await loadPosts(account, selectedFolder);
    await loadTotalUsers();
  }

  async function handleVote(targetAddress, hasVoted) {
    if (!account) return;
    if (hasVoted) {
      await fetch(`${API}/api/votes`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voter: account, target: targetAddress }) });
      setMyVotes(prev => prev.filter(v => v !== targetAddress.toLowerCase()));
    } else {
      const r = await fetch(`${API}/api/votes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voter: account, target: targetAddress }) });
      const data = await r.json();
      if (data.error) { alert(data.error); return; }
      setMyVotes(prev => [...prev, targetAddress.toLowerCase()]);
    }
    await loadAllUsers();
    await loadRatings();
  }

  function navigate(id) { setPage(id); setMenuOpen(false); setViewingUser(null); if (id === "others") loadAllUsers(); if (id === "feed") loadFeed(); }

  const tierInfo = tier ? TIERS[tier] : null;

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap'); *{box-sizing:border-box;} body{background:#0f1117;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#00c4a0;border-radius:2px;} .mi:hover{background:rgba(255,255,255,0.06)!important;} .ch:hover{border-color:rgba(0,196,160,0.3)!important;transform:translateY(-2px);transition:all 0.2s;}`}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[{top:"5%",left:"2%",size:180,r:-15},{top:"20%",right:"3%",size:140,r:10},{top:"50%",left:"1%",size:120,r:-5},{top:"70%",right:"5%",size:160,r:20},{top:"85%",left:"8%",size:100,r:-10}].map((m,i)=>(
          <div key={i} style={{position:"absolute",top:m.top,left:m.left,right:m.right,width:m.size,height:m.size,transform:`rotate(${m.r}deg)`,opacity:0.4}} dangerouslySetInnerHTML={{__html:MUSHROOM_SVG}}/>
        ))}
      </div>

      <div style={S.header}>
        <div onClick={() => navigate("home")} style={{ fontSize: "1.3rem", color: "#fff", cursor: "pointer" }}>
          🍄 <span style={{ background: "linear-gradient(135deg,#00c4a0,#0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AMANITA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {account && <div style={{ fontSize: "0.75rem", color: "#00c4a0", background: "rgba(0,196,160,0.1)", padding: "0.3rem 0.8rem", borderRadius: "20px", border: "1px solid rgba(0,196,160,0.2)" }}>{account.slice(0,6)}...{account.slice(-4)}</div>}
          {!account && <button onClick={() => modal.open()} style={S.btn}>🦊 Войти</button>}
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", width: "40px", height: "40px", borderRadius: "8px", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>☰</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: "3rem", background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", minWidth: "200px", zIndex: 200, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="mi" onClick={() => navigate(item.id)} style={{ padding: "0.8rem 1.2rem", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.75rem", color: page === item.id ? "#00c4a0" : "#e2e8f0", fontSize: "0.9rem" }}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
                {account && <div className="mi" onClick={() => { modal.disconnect(); setMenuOpen(false); setPage("home"); }} style={{ padding: "0.8rem 1.2rem", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem" }}><span>🚪</span><span>Выйти</span></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem", position: "relative", zIndex: 1 }}>

        {page === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem", filter: "drop-shadow(0 0 30px rgba(0,196,160,0.3))" }}>🍄</div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "1rem" }}>
                Amanita<br/><span style={{ background: "linear-gradient(135deg,#00c4a0,#0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Network</span>
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>Открытая децентрализованная сеть для обмена опытом</p>

              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(0,196,160,0.08)", border: "1px solid rgba(0,196,160,0.2)", borderRadius: "16px", padding: "1.2rem 2.5rem", marginBottom: "1.5rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#00c4a0", lineHeight: 1 }}>{displayCount}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>участников в сети</div>
                </div>
              </div>

              {!account && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <button onClick={() => modal.open()} style={{ ...S.btn, padding: "0.9rem 2.5rem", fontSize: "1rem", borderRadius: "12px", boxShadow: "0 0 30px rgba(0,196,160,0.3)" }}>🦊 Войти через MetaMask</button>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Расширение для браузера или мобильное приложение</div>
                </div>
              )}
            </div>

            {account && (
              <div style={{ ...S.card, display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "3rem" }}>{AVATARS[profile?.avatar_index || 0]?.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: tierInfo?.color || "#9ca3af", fontSize: "1.1rem", fontWeight: 700 }}>{profile?.nickname || "Без ника"} · {tierInfo?.name || "Зерно"}</div>
                  <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{parseFloat(balance || 0).toLocaleString()} SHEVELEV · ⭐ {profile?.vote_count || 0} голосов</div>
                  {profile?.status && <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.3rem" }}>"{profile.status}"</div>}
                </div>
                <button onClick={() => navigate("profile")} style={S.btnSm}>Мой профиль</button>
              </div>
            )}

            {/* РЕЙТИНГИ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>

              {/* ТОП ПО ТОКЕНАМ */}
              <div style={S.card}>
                <h3 style={{ color: "#fbbf24", marginBottom: "1rem", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  🪙 Топ по токенам SHEVELEV
                </h3>
                {topByTokens.length === 0
                  ? <div style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>Загрузка...</div>
                  : topByTokens.map((u, i) => (
                    <div key={u.address} onClick={() => { setViewingUser(u.address); navigate("others"); }} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < topByTokens.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}>
                      <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#64748b", fontWeight: 700, width: "20px", fontSize: "0.9rem" }}>#{i+1}</span>
                      <span style={{ fontSize: "1.2rem" }}>{AVATARS[u.avatar_index || 0]?.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                        <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{(u.shevelev || 0).toLocaleString()} SHEVELEV</div>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* ТОП ПО ГОЛОСАМ */}
              <div style={S.card}>
                <h3 style={{ color: "#c084fc", marginBottom: "1rem", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  ⭐ Топ по голосам
                </h3>
                {topByVotes.length === 0
                  ? <div style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>Загрузка...</div>
                  : topByVotes.map((u, i) => (
                    <div key={u.address} onClick={() => { setViewingUser(u.address); navigate("others"); }} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < topByVotes.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}>
                      <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#64748b", fontWeight: 700, width: "20px", fontSize: "0.9rem" }}>#{i+1}</span>
                      <span style={{ fontSize: "1.2rem" }}>{AVATARS[u.avatar_index || 0]?.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                        <div style={{ color: "#64748b", fontSize: "0.75rem" }}>⭐ {u.vote_count || 0} голосов</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {!account && (
              <div style={S.card}>
                <h3 style={{ color: "#00c4a0", marginBottom: "1rem", fontSize: "0.95rem" }}>Как войти?</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "1rem" }}><span style={{ fontSize: "1.5rem" }}>💻</span><div><div style={{ color: "#fff", fontSize: "0.9rem" }}>Через браузер</div><div style={{ color: "#64748b", fontSize: "0.85rem" }}>Установите расширение MetaMask для Chrome, Edge или Firefox.</div></div></div>
                  <div style={{ display: "flex", gap: "1rem" }}><span style={{ fontSize: "1.5rem" }}>📱</span><div><div style={{ color: "#fff", fontSize: "0.9rem" }}>Через телефон</div><div style={{ color: "#64748b", fontSize: "0.85rem" }}>Установите приложение MetaMask. Откройте сайт внутри браузера MetaMask.</div></div></div>
                </div>
              </div>
            )}
          </div>
        )}

        {page === "profile" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>👤 Моя страница</h2>
            {!account
              ? <div style={{ ...S.card, textAlign: "center", color: "#64748b", padding: "3rem" }}><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div><p>Подключите кошелёк</p><button onClick={() => modal.open()} style={{ ...S.btn, marginTop: "1rem" }}>🦊 Войти</button></div>
              : <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={S.card}>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg,${tierInfo?.color || "#9ca3af"}33,#0f1117)`, border: `2px solid ${tierInfo?.color || "#9ca3af"}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>
                        {AVATARS[profile?.avatar_index || 0]?.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{profile?.nickname || "Без ника"}</span>
                          <span style={{ color: tierInfo?.color || "#9ca3af", background: (tierInfo?.color || "#9ca3af") + "20", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.8rem" }}>{tierInfo?.icon} {tierInfo?.name || "Зерно"}</span>
                        </div>
                        {profile?.status && <div style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: "0.5rem" }}>"{profile.status}"</div>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                          <span>{MUSHROOMS[profile?.mushroom_type || "red"]}</span>
                          <span>📅 Стаж: {profile?.experience_days || 0} дней</span>
                          <span>🗓 {profile ? daysAgo(profile.joined_at) : 0} дней на платформе</span>
                          <span>📝 {profile?.post_count || 0} постов</span>
                          <span>⭐ {profile?.vote_count || 0} голосов</span>
                        </div>
                        <div style={{ marginTop: "0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{parseFloat(balance || 0).toLocaleString()} SHEVELEV</div>
                      </div>
                      <button onClick={() => setEditingProfile(!editingProfile)} style={S.btnSm}>{editingProfile ? "Отмена" : "✏️ Редактировать"}</button>
                    </div>

                    {editingProfile && (
                      <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "1rem" }}>
                          <div><label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Ник</label><input value={profileForm.nickname} onChange={e => setProfileForm({ ...profileForm, nickname: e.target.value })} style={S.input} maxLength={32} /></div>
                          <div><label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Статус</label><input value={profileForm.status} onChange={e => setProfileForm({ ...profileForm, status: e.target.value })} style={S.input} maxLength={100} /></div>
                          <div><label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Пол</label><select value={profileForm.gender} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })} style={S.select}><option value="">Не указан</option><option value="male">♂️ Мужчина</option><option value="female">♀️ Женщина</option></select></div>
                          <div><label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Любимый мухомор</label><select value={profileForm.mushroom_type} onChange={e => setProfileForm({ ...profileForm, mushroom_type: e.target.value })} style={S.select}><option value="red">🍄 Красный</option><option value="panther">🟤 Пантерный</option><option value="royal">⚪ Королевский</option></select></div>
                          <div><label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Стаж (дней)</label><input type="number" value={profileForm.experience_days} onChange={e => setProfileForm({ ...profileForm, experience_days: parseInt(e.target.value) || 0 })} style={S.input} min="0" /></div>
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.75rem" }}>Аватар</label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr))", gap: "0.5rem" }}>
                            {AVATARS.map(av => (
                              <div key={av.id} onClick={() => setProfileForm({ ...profileForm, avatar_index: av.id })} style={{ background: profileForm.avatar_index === av.id ? "rgba(0,196,160,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${profileForm.avatar_index === av.id ? "#00c4a0" : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", padding: "0.5rem", textAlign: "center", cursor: "pointer" }}>
                                <div style={{ fontSize: "1.8rem" }}>{av.emoji}</div>
                                <div style={{ fontSize: "0.6rem", color: "#64748b", marginTop: "0.2rem" }}>{av.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={saveProfile} style={S.btn}>Сохранить</button>
                      </div>
                    )}
                  </div>

                  <div style={S.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <h3 style={{ color: "#fff", fontSize: "1rem" }}>📁 Папки и посты</h3>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => setShowNewFolder(!showNewFolder)} style={S.btnSm}>+ Папка</button>
                        <button onClick={() => setShowNewPost(!showNewPost)} style={S.btn}>+ Пост</button>
                      </div>
                    </div>

                    {showNewFolder && (
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                        <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Название папки..." style={S.input} />
                        <button onClick={createFolder} style={S.btn}>Создать</button>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      <button onClick={() => { setSelectedFolder(null); loadPosts(account); }} style={{ ...S.btnSm, borderColor: !selectedFolder ? "#00c4a0" : "rgba(255,255,255,0.1)", color: !selectedFolder ? "#00c4a0" : "#e2e8f0" }}>Все</button>
                      {folders.map(f => (
                        <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          {editingFolder === f.id ? (
                            <input defaultValue={f.name} onBlur={e => renameFolder(f.id, e.target.value)} onKeyDown={e => e.key === "Enter" && renameFolder(f.id, e.target.value)} style={{ ...S.input, width: "120px", fontSize: "0.8rem", padding: "0.3rem 0.6rem" }} autoFocus />
                          ) : (
                            <button onClick={() => { setSelectedFolder(f.id); loadPosts(account, f.id); }} style={{ ...S.btnSm, borderColor: selectedFolder === f.id ? "#00c4a0" : "rgba(255,255,255,0.1)", color: selectedFolder === f.id ? "#00c4a0" : "#e2e8f0" }}>📁 {f.name}</button>
                          )}
                          <button onClick={() => setEditingFolder(f.id)} style={{ ...S.btnSm, padding: "0.3rem 0.5rem" }}>✏️</button>
                          <button onClick={() => deleteFolder(f.id)} style={{ ...S.btnDanger, padding: "0.3rem 0.5rem" }}>🗑️</button>
                        </div>
                      ))}
                    </div>

                    {showNewPost && (
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <input value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Название поста..." style={{ ...S.input, marginBottom: "0.75rem" }} maxLength={200} />
                        <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} placeholder="Текст поста..." style={{ ...S.textarea, marginBottom: "0.75rem" }} maxLength={5000} />
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                          <select value={newPost.folder_id || ""} onChange={e => setNewPost({ ...newPost, folder_id: e.target.value || null })} style={{ ...S.select, flex: 1 }}>
                            <option value="">Без папки</option>
                            {folders.map(f => <option key={f.id} value={f.id}>📁 {f.name}</option>)}
                          </select>
                          <button onClick={createPost} style={S.btn}>Опубликовать</button>
                        </div>
                      </div>
                    )}

                    {posts.length === 0
                      ? <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Постов пока нет. Напишите первый!</div>
                      : posts.map(post => <PostCard key={post.id} post={{ ...post, nickname: profile?.nickname, avatar_index: profile?.avatar_index }} account={account} onReload={() => loadPosts(account, selectedFolder)} isOwner={true} />)
                    }
                  </div>
                </div>
            }
          </div>
        )}

        {page === "feed" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>📝 Лента</h2>
            {feed.length === 0
              ? <div style={{ ...S.card, textAlign: "center", color: "#64748b", padding: "3rem" }}><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍄</div><p>Постов пока нет...</p></div>
              : feed.map(post => <PostCard key={post.id} post={post} account={account} onReload={loadFeed} isOwner={account?.toLowerCase() === post.address?.toLowerCase()} />)
            }
          </div>
        )}

        {page === "chats" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>💬 Чаты</h2>
            <div style={{ ...S.card, textAlign: "center", color: "#64748b", padding: "3rem" }}><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍄</div><p>Чаты скоро появятся...</p></div>
          </div>
        )}

        {page === "others" && (
          <div>
            {viewingUser
              ? <UserPage address={viewingUser} account={account} myVotes={myVotes} onVote={handleVote} onBack={() => setViewingUser(null)} />
              : <div>
                  <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>👥 Участники сети</h2>
                  {allUsers.length === 0
                    ? <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Загрузка...</div>
                    : allUsers.map((u, i) => (
                      <div key={u.address} onClick={() => setViewingUser(u.address)} style={{ ...S.card, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }} className="ch">
                        <div style={{ color: "#64748b", width: "30px", textAlign: "center", fontSize: "0.85rem" }}>#{i+1}</div>
                        <div style={{ fontSize: "1.5rem" }}>{AVATARS[u.avatar_index || 0]?.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#00c4a0", fontWeight: 700 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                          <div style={{ color: "#64748b", fontSize: "0.8rem" }}>⭐ {u.vote_count || 0} · 📝 {u.post_count || 0} · 🗓 {daysAgo(u.joined_at)} дней</div>
                        </div>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>→</span>
                      </div>
                    ))
                  }
                </div>
            }
          </div>
        )}

        {page === "disclaimer" && (
          <div>
            <h2 style={{ color: "#fff", marginBottom: "1.5rem", fontWeight: 900 }}>⚠️ Дисклеймер</h2>
            <div style={{ ...S.card, lineHeight: 1.8 }}>
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

