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
const SHEVELEV_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

const TIERS = {
  1: { name: "Зерно", icon: "🌱", color: "#9ca3af" },
  2: { name: "Участник", icon: "🍄", color: "#4ade80" },
  3: { name: "Адепт", icon: "🌿", color: "#00c4a0" },
  4: { name: "Мастер", icon: "🔮", color: "#c084fc" },
  5: { name: "Легенда", icon: "⚜️", color: "#fbbf24" }
};

const MUSHROOMS = { red: "🍄 Красный", panther: "🟤 Пантерный", royal: "⚪ Королевский" };

const AVATARS = [
  { id: 0, emoji: "🧘" }, { id: 1, emoji: "🌲" }, { id: 2, emoji: "🦋" },
  { id: 3, emoji: "🌙" }, { id: 4, emoji: "🔮" }, { id: 5, emoji: "🌊" },
  { id: 6, emoji: "🦅" }, { id: 7, emoji: "🐺" }, { id: 8, emoji: "🌸" },
  { id: 9, emoji: "⚡" }, { id: 10, emoji: "🏔️" }, { id: 11, emoji: "🌿" },
  { id: 12, emoji: "🔥" }, { id: 13, emoji: "❄️" }, { id: 14, emoji: "🌞" },
  { id: 15, emoji: "🎭" }, { id: 16, emoji: "🧿" }, { id: 17, emoji: "🕊️" },
  { id: 18, emoji: "🐉" }, { id: 19, emoji: "🌀" },
];

const AVATAR_LABELS = ["Медитирующий","Лесной житель","Трансформация","Ночной искатель","Провидец","Поток","Орёл","Волк","Цветение","Молния","Горный","Травник","Огонь","Лёд","Солнечный","Маска","Глаз","Голубь","Дракон","Спираль"];

function daysAgo(date) { return Math.floor((Date.now() - new Date(date)) / 86400000); }
function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "только что";
  if (diff < 3600) return Math.floor(diff/60) + " мин";
  if (diff < 86400) return Math.floor(diff/3600) + " ч";
  if (diff < 604800) return Math.floor(diff/86400) + " дн";
  return d.toLocaleDateString("ru-RU");
}

const S = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#f3f4f6", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 400 },
  header: { background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1f1f1f", padding: "0 1rem", height: "56px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, maxWidth: "620px", margin: "0 auto", width: "100%" },
  headerWrap: { background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1f1f1f", position: "sticky", top: 0, zIndex: 100 },
  btn: { background: "#f3f4f6", color: "#0a0a0a", border: "none", padding: "0.55rem 1.2rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 },
  btnOutline: { background: "transparent", color: "#f3f4f6", border: "1px solid #333", padding: "0.55rem 1.2rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 },
  btnSm: { background: "transparent", color: "#9ca3af", border: "1px solid #2a2a2a", padding: "0.35rem 0.8rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" },
  btnDanger: { background: "transparent", color: "#ef4444", border: "none", padding: "0.35rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
  input: { background: "#141414", border: "1px solid #2a2a2a", color: "#f3f4f6", padding: "0.75rem 1rem", borderRadius: "12px", width: "100%", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" },
  textarea: { background: "#141414", border: "none", color: "#f3f4f6", padding: "0.5rem 0", borderRadius: "0", width: "100%", fontSize: "1rem", outline: "none", fontFamily: "inherit", resize: "none", minHeight: "80px", lineHeight: 1.5 },
  select: { background: "#141414", border: "1px solid #2a2a2a", color: "#f3f4f6", padding: "0.75rem 1rem", borderRadius: "12px", width: "100%", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" },
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #1f1f1f", display: "flex", justifyContent: "space-around", alignItems: "center", height: "56px", zIndex: 100 },
  navBtn: { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.5rem", fontSize: "1.4rem", lineHeight: 1 },
};

// ИКОНКИ
const Icon = {
  home: (active) => <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "#f3f4f6" : "none"} stroke={active ? "#f3f4f6" : "#9ca3af"} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: (active) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? "#f3f4f6" : "#9ca3af"} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  compose: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f3f4f6" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  heart: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#ef4444" : "none"} stroke={active ? "#ef4444" : "#9ca3af"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  comment: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  share: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  user: (active) => <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "#f3f4f6" : "none"} stroke={active ? "#f3f4f6" : "#9ca3af"} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3f4f6" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  token: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  star: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#fbbf24" : "none"} stroke={active ? "#fbbf24" : "#9ca3af"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  back: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3f4f6" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  folder: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
};

// МОДАЛЬНОЕ ОКНО ОТПРАВКИ ТОКЕНОВ
function SendTokensModal({ toAddress, toNickname, account, onClose }) {
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [waitingMM, setWaitingMM] = useState(false);

  async function sendTokens() {
    if (!amount || parseFloat(amount) <= 0) return;
    setSending(true);
    try {
      const walletProvider = modal.getWalletProvider();
      await walletProvider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x4B" }] }).catch(async () => {
        await walletProvider.request({ method: "wallet_addEthereumChain", params: [{ chainId: "0x4B", chainName: "Decimal Smart Chain", nativeCurrency: { name: "DEL", symbol: "DEL", decimals: 18 }, rpcUrls: ["https://node.decimalchain.com/web3/"] }] });
      });
      setWaitingMM(true);
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, signer);
      const tx = await shev.transfer(toAddress, ethers.parseEther(amount));
      setWaitingMM(false);
      await tx.wait();
      setDone(true);
    } catch (e) {
      setWaitingMM(false);
      if (!e.message.includes("rejected")) alert("Ошибка: " + e.message);
    }
    setSending(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#141414", borderRadius: "20px 20px 0 0", padding: "1.5rem", width: "100%", maxWidth: "620px", border: "1px solid #2a2a2a" }}>
        <div style={{ width: "40px", height: "4px", background: "#333", borderRadius: "2px", margin: "0 auto 1.5rem" }} />
        {done ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <div style={{ color: "#4ade80", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Токены отправлены!</div>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{amount} SHEVELEV → {toNickname || toAddress.slice(0,10)+"..."}</div>
            <button onClick={onClose} style={S.btn}>Закрыть</button>
          </div>
        ) : waitingMM ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🦊</div>
            <div style={{ color: "#f3f4f6", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Подтвердите транзакцию</div>
            <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>в MetaMask</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "#f3f4f6" }}>🪙 Отправить SHEVELEV</div>
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Получатель: <span style={{ color: "#00c4a0", fontWeight: 600 }}>{toNickname || toAddress.slice(0,12)+"..."}</span>
            </div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Количество SHEVELEV..." style={{ ...S.input, marginBottom: "1rem" }} min="0" />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={sendTokens} disabled={sending} style={{ ...S.btn, flex: 1 }}>{sending ? "..." : "Отправить"}</button>
              <button onClick={onClose} style={S.btnOutline}>Отмена</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// КАРТОЧКА ПОСТА
function PostCard({ post, account, onReload, isOwner, onUserClick }) {
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
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadComments() {
    const r = await fetch(`${API}/api/comments/${post.id}`);
    setComments(await r.json());
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
    setEditing(false); onReload();
  }

  async function deletePost() {
    if (!window.confirm("Удалить пост?")) return;
    await fetch(`${API}/api/posts/${post.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account }) });
    onReload();
  }

  async function handleLike() {
    if (!account) return;
    const prev = myLike;
    if (prev === "like") { setMyLike(null); setLikes(l => l - 1); }
    else { if (prev === "dislike") setDislikes(d => d - 1); setMyLike("like"); setLikes(l => l + 1); }
    await fetch(`${API}/api/post-likes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, post_id: post.id, type: prev === "like" ? null : "like" }) });
  }

  const tierInfo = TIERS[post.tier] || TIERS[1];

  return (
    <div style={{ borderBottom: "1px solid #1f1f1f", padding: "1rem 1rem 0.75rem" }}>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {/* Аватар */}
        <div onClick={() => onUserClick && onUserClick(post.address)} style={{ flexShrink: 0, cursor: "pointer" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg, ${tierInfo.color}44, #1a1a1a)`, border: `2px solid ${tierInfo.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
            {AVATARS[post.avatar_index || 0]?.emoji}
          </div>
        </div>

        {/* Контент */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <span onClick={() => onUserClick && onUserClick(post.address)} style={{ color: "#f3f4f6", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>{post.nickname || post.address?.slice(0,8)+"..."}</span>
            <span style={{ color: tierInfo.color, fontSize: "0.75rem" }}>{tierInfo.icon}</span>
            {post.folder_name && <span style={{ color: "#4b5563", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>{Icon.folder()} {post.folder_name}</span>}
            <span style={{ color: "#4b5563", fontSize: "0.8rem", marginLeft: "auto" }}>{formatDate(post.created_at)}</span>
            {isOwner && (
              <div style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: "0 0.3rem", fontSize: "1.1rem" }}>···</button>
                {menuOpen && (
                  <div style={{ position: "absolute", right: 0, top: "1.5rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", minWidth: "140px", zIndex: 10, overflow: "hidden" }}>
                    <div onClick={() => { setEditing(true); setMenuOpen(false); }} style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: "#f3f4f6", fontSize: "0.9rem", borderBottom: "1px solid #2a2a2a" }}>{Icon.edit()} Изменить</div>
                    <div onClick={() => { deletePost(); setMenuOpen(false); }} style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontSize: "0.9rem" }}>{Icon.trash()} Удалить</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {editing ? (
            <div>
              <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} style={{ ...S.input, marginBottom: "0.5rem", fontSize: "0.9rem" }} />
              <textarea value={editData.content} onChange={e => setEditData({ ...editData, content: e.target.value })} style={{ ...S.textarea, background: "#141414", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.5rem", marginBottom: "0.5rem" }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={savePost} style={S.btn}>Сохранить</button>
                <button onClick={() => setEditing(false)} style={S.btnOutline}>Отмена</button>
              </div>
            </div>
          ) : (
            <>
              {post.title && <div style={{ color: "#f3f4f6", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{post.title}</div>}
              <div style={{ color: "#d1d5db", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{post.content}</div>
            </>
          )}

          {/* Действия */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem" }}>
            <button onClick={handleLike} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", color: myLike === "like" ? "#ef4444" : "#9ca3af", fontSize: "0.85rem", padding: 0 }}>
              {Icon.heart(myLike === "like")} {likes > 0 && likes}
            </button>
            <button onClick={toggleComments} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", color: "#9ca3af", fontSize: "0.85rem", padding: 0 }}>
              {Icon.comment()} {post.comment_count > 0 && post.comment_count}
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", color: "#9ca3af", fontSize: "0.85rem", padding: 0 }}>
              {Icon.share()}
            </button>
          </div>

          {/* Комментарии */}
          {showComments && (
            <div style={{ marginTop: "0.75rem" }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", paddingLeft: c.parent_id ? "1.5rem" : "0" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                    {AVATARS[c.avatar_index || 0]?.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                      <span style={{ color: "#f3f4f6", fontWeight: 600, fontSize: "0.85rem" }}>{c.nickname || c.address?.slice(0,8)+"..."}</span>
                      <span style={{ color: "#4b5563", fontSize: "0.75rem" }}>{formatDate(c.created_at)}</span>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem" }}>
                        <button onClick={() => setReplyTo(c)} style={{ ...S.btnSm, padding: "0.2rem 0.4rem", fontSize: "0.75rem" }}>↩</button>
                        {account === c.address && <button onClick={() => { setEditingComment(c.id); setEditCommentText(c.content); }} style={{ ...S.btnSm, padding: "0.2rem 0.4rem" }}>{Icon.edit()}</button>}
                        {(account === c.address || isOwner) && <button onClick={() => deleteComment(c.id)} style={{ ...S.btnDanger, padding: "0.2rem 0.4rem" }}>{Icon.trash()}</button>}
                      </div>
                    </div>
                    {editingComment === c.id ? (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <input value={editCommentText} onChange={e => setEditCommentText(e.target.value)} style={{ ...S.input, fontSize: "0.85rem", padding: "0.4rem 0.7rem" }} />
                        <button onClick={() => saveEditComment(c.id)} style={S.btn}>✓</button>
                        <button onClick={() => setEditingComment(null)} style={S.btnOutline}>✕</button>
                      </div>
                    ) : (
                      <div style={{ color: "#d1d5db", fontSize: "0.9rem" }}>{c.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {account && (
                <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🧘</div>
                  <div style={{ flex: 1 }}>
                    {replyTo && (
                      <div style={{ color: "#00c4a0", fontSize: "0.8rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        ↩ {replyTo.nickname || replyTo.address?.slice(0,8)+"..."}
                        <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Добавить комментарий..." style={{ ...S.input, padding: "0.5rem 0.8rem", fontSize: "0.9rem" }} onKeyDown={e => e.key === "Enter" && submitComment()} />
                      <button onClick={submitComment} style={{ ...S.btn, padding: "0.5rem 0.9rem" }}>→</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// СТРАНИЦА ПОЛЬЗОВАТЕЛЯ
function UserPage({ address, account, myVotes, onVote, onBack }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showSend, setShowSend] = useState(false);
  const [tab, setTab] = useState("posts");

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
      const [t, bal] = await Promise.all([
        new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider).getTier(address),
        new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider).balanceOf(address)
      ]);
      setTier(Number(t)); setBalance(ethers.formatEther(bal));
    } catch (e) { console.error(e); }
  }

  async function loadPostsByFolder(fId) {
    setSelectedFolder(fId);
    const r = await fetch(fId ? `${API}/api/posts/${address}?folder_id=${fId}` : `${API}/api/posts/${address}`);
    setPosts(await r.json());
  }

  const tierInfo = tier ? TIERS[tier] : TIERS[1];
  const hasVoted = myVotes.includes(address.toLowerCase());
  const isMe = account?.toLowerCase() === address.toLowerCase();

  if (!user) return <div style={{ color: "#9ca3af", padding: "3rem", textAlign: "center" }}>Загрузка...</div>;

  return (
    <div style={{ paddingBottom: "70px" }}>
      {showSend && <SendTokensModal toAddress={address} toNickname={user.nickname} account={account} onClose={() => setShowSend(false)} />}

      {/* Шапка профиля */}
      <div style={{ padding: "1.5rem 1rem 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#f3f4f6", cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>{Icon.back()} Назад</button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f3f4f6", marginBottom: "0.2rem" }}>{user.nickname || address.slice(0,8)+"..."}</div>
            <div style={{ color: tierInfo.color, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>{tierInfo.icon} {tierInfo.name}</div>
          </div>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${tierInfo.color}44, #1a1a1a)`, border: `2px solid ${tierInfo.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
            {AVATARS[user.avatar_index || 0]?.emoji}
          </div>
        </div>

        {user.status && <div style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{user.status}</div>}

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span>📝 {user.post_count || 0} постов</span>
          <span>⭐ {user.vote_count || 0} голосов</span>
          <span>📅 {user.experience_days || 0} дн стажа</span>
          <span>🪙 {parseFloat(balance || 0).toLocaleString()} SHV</span>
        </div>

        {!isMe && account && (
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <button onClick={() => onVote(address, hasVoted)} style={{ ...hasVoted ? S.btnOutline : S.btn, flex: 1, fontSize: "0.9rem" }}>
              {hasVoted ? "⭐ Голос дан" : "⭐ Голосовать"}
            </button>
            <button onClick={() => setShowSend(true)} style={{ ...S.btnOutline, flex: 1, fontSize: "0.9rem" }}>🪙 Отправить</button>
          </div>
        )}

        {/* Папки */}
        {folders.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
            <button onClick={() => loadPostsByFolder(null)} style={{ ...S.btnSm, whiteSpace: "nowrap", color: !selectedFolder ? "#f3f4f6" : "#9ca3af", borderColor: !selectedFolder ? "#555" : "#2a2a2a" }}>Все</button>
            {folders.map(f => (
              <button key={f.id} onClick={() => loadPostsByFolder(f.id)} style={{ ...S.btnSm, whiteSpace: "nowrap", color: selectedFolder === f.id ? "#f3f4f6" : "#9ca3af", borderColor: selectedFolder === f.id ? "#555" : "#2a2a2a" }}>📁 {f.name}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #1f1f1f" }} />

      {posts.length === 0
        ? <div style={{ textAlign: "center", color: "#4b5563", padding: "3rem" }}>Постов пока нет</div>
        : posts.map(post => <PostCard key={post.id} post={{ ...post, nickname: user.nickname, avatar_index: user.avatar_index, tier }} account={account} onReload={() => loadPostsByFolder(selectedFolder)} isOwner={isMe} onUserClick={() => {}} />)
      }
    </div>
  );
}

// МОДАЛКА НОВОГО ПОСТА
function ComposeModal({ account, profile, folders, onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [posting, setPosting] = useState(false);

  async function submit() {
    if (!content.trim()) return;
    setPosting(true);
    await fetch(`${API}/api/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account, title, content, folder_id: folderId }) });
    setPosting(false);
    onPost(); onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#0f0f0f", borderRadius: "20px 20px 0 0", padding: "1.25rem", width: "100%", maxWidth: "620px", border: "1px solid #1f1f1f" }}>
        <div style={{ width: "40px", height: "4px", background: "#333", borderRadius: "2px", margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
            {AVATARS[profile?.avatar_index || 0]?.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#f3f4f6", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{profile?.nickname || "Аноним"}</div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок (необязательно)..." style={{ ...S.input, marginBottom: "0.5rem", fontSize: "0.9rem" }} maxLength={200} />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Что происходит?..." style={{ ...S.textarea, fontSize: "1rem" }} maxLength={5000} autoFocus />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #1f1f1f" }}>
          {folders.length > 0 && (
            <select value={folderId || ""} onChange={e => setFolderId(e.target.value || null)} style={{ ...S.select, flex: 1, fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}>
              <option value="">Без папки</option>
              {folders.map(f => <option key={f.id} value={f.id}>📁 {f.name}</option>)}
            </select>
          )}
          <button onClick={onClose} style={{ ...S.btnOutline, fontSize: "0.9rem" }}>Отмена</button>
          <button onClick={submit} disabled={posting || !content.trim()} style={{ ...S.btn, fontSize: "0.9rem", opacity: !content.trim() ? 0.5 : 1 }}>{posting ? "..." : "Опубликовать"}</button>
        </div>
      </div>
    </div>
  );
}

// ГЛАВНОЕ ПРИЛОЖЕНИЕ
export default function App() {
  const [account, setAccount] = useState(null);
  const [tier, setTier] = useState(null);
  const [balance, setBalance] = useState(null);
  const [page, setPage] = useState("feed");
  const [profile, setProfile] = useState(null);
  const [feed, setFeed] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [myVotes, setMyVotes] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [profileForm, setProfileForm] = useState({ nickname: "", avatar_index: 0, gender: "", mushroom_type: "red", experience_days: 0, status: "" });
  const [topByTokens, setTopByTokens] = useState([]);
  const [topByVotes, setTopByVotes] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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
    loadFeed();
    loadRatings();
  }, []);

  async function loadChainData(addr) {
    try {
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const [t, bal] = await Promise.all([
        new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider).getTier(addr),
        new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider).balanceOf(addr)
      ]);
      setTier(Number(t)); setBalance(ethers.formatEther(bal));
    } catch (e) { console.error(e); }
  }

  async function loadProfile(addr) {
    try {
      const data = await fetch(`${API}/api/users/${addr.toLowerCase()}`).then(r => r.json());
      setProfile(data);
      if (data) setProfileForm({ nickname: data.nickname || "", avatar_index: data.avatar_index || 0, gender: data.gender || "", mushroom_type: data.mushroom_type || "red", experience_days: data.experience_days || 0, status: data.status || "" });
      await loadFolders(addr);
      await loadPosts(addr);
    } catch (e) { console.error(e); }
  }

  async function loadMyVotes(addr) {
    try { setMyVotes(await fetch(`${API}/api/votes/${addr.toLowerCase()}`).then(r => r.json())); }
    catch (e) { console.error(e); }
  }

  async function loadFeed() {
    try { setFeed(await fetch(`${API}/api/feed`).then(r => r.json())); }
    catch (e) { console.error(e); }
  }

  async function loadFolders(addr) {
    try { setFolders(await fetch(`${API}/api/folders/${addr.toLowerCase()}`).then(r => r.json())); }
    catch (e) { console.error(e); }
  }

  async function loadPosts(addr, fId = null) {
    try {
      const url = fId ? `${API}/api/posts/${addr.toLowerCase()}?folder_id=${fId}` : `${API}/api/posts/${addr.toLowerCase()}`;
      setPosts(await fetch(url).then(r => r.json()));
    } catch (e) { console.error(e); }
  }

  async function loadAllUsers() {
    try { setAllUsers(await fetch(`${API}/api/users`).then(r => r.json())); }
    catch (e) { console.error(e); }
  }

  async function loadRatings() {
    try {
      const users = await fetch(`${API}/api/users`).then(r => r.json());
      setTotalUsers(users.length);
      setTopByVotes([...users].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0)).slice(0, 5));
      const provider = new ethers.JsonRpcProvider("https://node.decimalchain.com/web3/");
      const shev = new ethers.Contract(SHEVELEV_ADDRESS, SHEVELEV_ABI, provider);
      const withBal = await Promise.all(users.map(async u => {
        try { return { ...u, shevelev: parseFloat(ethers.formatEther(await shev.balanceOf(u.address))) }; }
        catch { return { ...u, shevelev: 0 }; }
      }));
      setTopByTokens([...withBal].sort((a, b) => b.shevelev - a.shevelev).slice(0, 5));
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
    setEditingFolder(null); await loadFolders(account);
  }

  async function deleteFolder(id) {
    if (!window.confirm("Удалить папку?")) return;
    await fetch(`${API}/api/folders/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: account }) });
    setSelectedFolder(null); await loadFolders(account); await loadPosts(account);
  }

  async function handleVote(targetAddress, hasVoted) {
    if (!account) return;
    if (hasVoted) {
      await fetch(`${API}/api/votes`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voter: account, target: targetAddress }) });
      setMyVotes(prev => prev.filter(v => v !== targetAddress.toLowerCase()));
    } else {
      const data = await fetch(`${API}/api/votes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voter: account, target: targetAddress }) }).then(r => r.json());
      if (data.error) { alert(data.error); return; }
      setMyVotes(prev => [...prev, targetAddress.toLowerCase()]);
    }
    await loadAllUsers(); await loadRatings();
  }

  function navigate(p) {
    setPage(p); setViewingUser(null); setShowMenu(false);
    if (p === "search") loadAllUsers();
    if (p === "feed") loadFeed();
  }

  function openUser(addr) { setViewingUser(addr); setPage("user"); }

  const tierInfo = tier ? TIERS[tier] : TIERS[1];
  const filteredUsers = allUsers.filter(u => !searchQuery || (u.nickname || "").toLowerCase().includes(searchQuery.toLowerCase()) || u.address.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={S.page}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0a0a; } input::placeholder, textarea::placeholder { color: #4b5563; } ::-webkit-scrollbar { width: 0; } button { font-family: inherit; }`}</style>

      {/* ХЕДЕР */}
      <div style={S.headerWrap}>
        <div style={{ ...S.header, position: "relative" }}>
          {page === "user" || page === "profile" ? (
            <button onClick={() => page === "user" ? setPage("feed") : null} style={{ background: "none", border: "none", color: "#f3f4f6", cursor: "pointer" }}>
              {page === "user" ? Icon.back() : null}
            </button>
          ) : (
            <div style={{ fontSize: "1.3rem" }}>🍄</div>
          )}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", color: "#f3f4f6", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>Amanita</div>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", color: "#f3f4f6", cursor: "pointer" }}>{Icon.menu()}</button>
        </div>
      </div>

      {/* БОКОВОЕ МЕНЮ */}
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500 }}>
          <div onClick={() => setShowMenu(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "280px", background: "#0f0f0f", borderLeft: "1px solid #1f1f1f", padding: "2rem 1.5rem", display: "flex", flexDirection: "column" }}>
            {account && (
              <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #1f1f1f" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${tierInfo.color}44, #1a1a1a)`, border: `2px solid ${tierInfo.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                  {AVATARS[profile?.avatar_index || 0]?.emoji}
                </div>
                <div style={{ color: "#f3f4f6", fontWeight: 700, fontSize: "1rem" }}>{profile?.nickname || "Без ника"}</div>
                <div style={{ color: tierInfo.color, fontSize: "0.8rem" }}>{tierInfo.icon} {tierInfo.name}</div>
                <div style={{ color: "#4b5563", fontSize: "0.8rem", marginTop: "0.3rem" }}>{parseFloat(balance || 0).toLocaleString()} SHEVELEV</div>
              </div>
            )}
            {[
              { id: "feed", label: "🏠 Лента" },
              { id: "profile", label: "👤 Профиль" },
              { id: "search", label: "🔍 Участники" },
              { id: "ratings", label: "🏆 Рейтинги" },
              { id: "disclaimer", label: "⚠️ Дисклеймер" },
            ].map(item => (
              <button key={item.id} onClick={() => navigate(item.id)} style={{ background: page === item.id ? "#1a1a1a" : "none", border: "none", color: page === item.id ? "#f3f4f6" : "#9ca3af", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer", textAlign: "left", fontSize: "0.95rem", fontWeight: page === item.id ? 700 : 400, marginBottom: "0.25rem" }}>
                {item.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {!account
              ? <button onClick={() => { modal.open(); setShowMenu(false); }} style={S.btn}>🦊 Войти</button>
              : <button onClick={() => { modal.disconnect(); setShowMenu(false); setPage("feed"); }} style={{ ...S.btnOutline, color: "#ef4444", borderColor: "#ef4444" }}>🚪 Выйти</button>
            }
          </div>
        </div>
      )}

      {showCompose && account && (
        <ComposeModal account={account} profile={profile} folders={folders} onClose={() => setShowCompose(false)} onPost={() => { loadFeed(); loadPosts(account); }} />
      )}

      {/* КОНТЕНТ */}
      <div style={{ maxWidth: "620px", margin: "0 auto", paddingBottom: "70px" }}>

        {/* ЛЕНТА */}
        {page === "feed" && (
          <div>
            {!account && (
              <div style={{ padding: "2rem 1rem", textAlign: "center", borderBottom: "1px solid #1f1f1f" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🍄</div>
                <div style={{ color: "#f3f4f6", fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Добро пожаловать</div>
                <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Децентрализованная сеть для обмена опытом</div>
                <button onClick={() => modal.open()} style={S.btn}>🦊 Войти через MetaMask</button>
              </div>
            )}
            {feed.length === 0
              ? <div style={{ textAlign: "center", color: "#4b5563", padding: "4rem 1rem" }}>Постов пока нет</div>
              : feed.map(post => <PostCard key={post.id} post={post} account={account} onReload={loadFeed} isOwner={account?.toLowerCase() === post.address?.toLowerCase()} onUserClick={openUser} />)
            }
          </div>
        )}

        {/* ПОИСК */}
        {page === "search" && (
          <div>
            <div style={{ padding: "1rem", borderBottom: "1px solid #1f1f1f" }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Поиск участников..." style={{ ...S.input }} />
            </div>
            {filteredUsers.map((u, i) => (
              <div key={u.address} onClick={() => openUser(u.address)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.9rem 1rem", borderBottom: "1px solid #1f1f1f", cursor: "pointer" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                  {AVATARS[u.avatar_index || 0]?.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f3f4f6", fontWeight: 700, fontSize: "0.95rem" }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>⭐ {u.vote_count || 0} · 📝 {u.post_count || 0} постов</div>
                </div>
                <div style={{ color: "#4b5563", fontSize: "0.85rem" }}>→</div>
              </div>
            ))}
          </div>
        )}

        {/* ПРОФИЛЬ */}
        {page === "profile" && (
          <div style={{ padding: "1.5rem 1rem" }}>
            {!account ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
                <div style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>Подключите кошелёк</div>
                <button onClick={() => modal.open()} style={S.btn}>🦊 Войти</button>
              </div>
            ) : (
              <div>
                {/* Шапка профиля */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f3f4f6", marginBottom: "0.2rem" }}>{profile?.nickname || "Без ника"}</div>
                    <div style={{ color: tierInfo.color, fontSize: "0.85rem" }}>{tierInfo.icon} {tierInfo.name}</div>
                    <div style={{ color: "#4b5563", fontSize: "0.8rem", marginTop: "0.3rem" }}>{account.slice(0,8)}...{account.slice(-4)}</div>
                  </div>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `linear-gradient(135deg, ${tierInfo.color}44, #1a1a1a)`, border: `2px solid ${tierInfo.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem" }}>
                    {AVATARS[profile?.avatar_index || 0]?.emoji}
                  </div>
                </div>

                {profile?.status && <div style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "1rem" }}>{profile.status}</div>}

                <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  <span>📝 {profile?.post_count || 0} постов</span>
                  <span>⭐ {profile?.vote_count || 0} голосов</span>
                  <span>🪙 {parseFloat(balance || 0).toLocaleString()} SHV</span>
                  <span>📅 {profile?.experience_days || 0} дн стажа</span>
                </div>

                <button onClick={() => setEditingProfile(!editingProfile)} style={{ ...S.btnOutline, width: "100%", marginBottom: "1.5rem" }}>
                  {editingProfile ? "Отмена" : "✏️ Редактировать профиль"}
                </button>

                {editingProfile && (
                  <div style={{ background: "#0f0f0f", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem", border: "1px solid #1f1f1f" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div><div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Ник</div><input value={profileForm.nickname} onChange={e => setProfileForm({ ...profileForm, nickname: e.target.value })} style={S.input} maxLength={32} /></div>
                      <div><div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Статус</div><input value={profileForm.status} onChange={e => setProfileForm({ ...profileForm, status: e.target.value })} style={S.input} maxLength={100} /></div>
                      <div><div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Пол</div><select value={profileForm.gender} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })} style={S.select}><option value="">Не указан</option><option value="male">♂️ Мужчина</option><option value="female">♀️ Женщина</option></select></div>
                      <div><div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Любимый мухомор</div><select value={profileForm.mushroom_type} onChange={e => setProfileForm({ ...profileForm, mushroom_type: e.target.value })} style={S.select}><option value="red">🍄 Красный</option><option value="panther">🟤 Пантерный</option><option value="royal">⚪ Королевский</option></select></div>
                      <div><div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Стаж (дней)</div><input type="number" value={profileForm.experience_days} onChange={e => setProfileForm({ ...profileForm, experience_days: parseInt(e.target.value) || 0 })} style={S.input} min="0" /></div>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "0.75rem" }}>Аватар</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
                        {AVATARS.map(av => (
                          <div key={av.id} onClick={() => setProfileForm({ ...profileForm, avatar_index: av.id })} style={{ background: profileForm.avatar_index === av.id ? "#1a1a1a" : "transparent", border: `1px solid ${profileForm.avatar_index === av.id ? "#555" : "#2a2a2a"}`, borderRadius: "10px", padding: "0.6rem", textAlign: "center", cursor: "pointer" }}>
                            <div style={{ fontSize: "1.6rem" }}>{av.emoji}</div>
                            <div style={{ fontSize: "0.55rem", color: "#4b5563", marginTop: "0.2rem" }}>{AVATAR_LABELS[av.id]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={saveProfile} style={{ ...S.btn, width: "100%" }}>Сохранить</button>
                  </div>
                )}

                {/* Папки */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ color: "#f3f4f6", fontWeight: 700 }}>📁 Папки</div>
                    <button onClick={() => setShowNewFolder(!showNewFolder)} style={S.btnSm}>+ Папка</button>
                  </div>
                  {showNewFolder && (
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Название..." style={{ ...S.input, fontSize: "0.9rem" }} />
                      <button onClick={createFolder} style={S.btn}>Создать</button>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {folders.map(f => (
                      <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#141414", borderRadius: "8px", padding: "0.3rem 0.6rem", border: "1px solid #2a2a2a" }}>
                        {editingFolder === f.id ? (
                          <input defaultValue={f.name} onBlur={e => renameFolder(f.id, e.target.value)} onKeyDown={e => e.key === "Enter" && renameFolder(f.id, e.target.value)} style={{ ...S.input, width: "100px", fontSize: "0.8rem", padding: "0.2rem 0.4rem" }} autoFocus />
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>📁 {f.name}</span>
                        )}
                        <button onClick={() => setEditingFolder(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: "0.75rem" }}>✏️</button>
                        <button onClick={() => deleteFolder(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.75rem" }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ color: "#f3f4f6", fontWeight: 700 }}>Мои посты</div>
                    <button onClick={() => setShowCompose(true)} style={S.btn}>+ Пост</button>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "0.75rem" }}>
                    <button onClick={() => { setSelectedFolder(null); loadPosts(account); }} style={{ ...S.btnSm, whiteSpace: "nowrap", color: !selectedFolder ? "#f3f4f6" : "#9ca3af" }}>Все</button>
                    {folders.map(f => <button key={f.id} onClick={() => { setSelectedFolder(f.id); loadPosts(account, f.id); }} style={{ ...S.btnSm, whiteSpace: "nowrap", color: selectedFolder === f.id ? "#f3f4f6" : "#9ca3af" }}>📁 {f.name}</button>)}
                  </div>
                </div>

                {posts.length === 0
                  ? <div style={{ textAlign: "center", color: "#4b5563", padding: "2rem" }}>Постов пока нет</div>
                  : posts.map(post => <PostCard key={post.id} post={{ ...post, nickname: profile?.nickname, avatar_index: profile?.avatar_index, tier }} account={account} onReload={() => loadPosts(account, selectedFolder)} isOwner={true} onUserClick={() => {}} />)
                }
              </div>
            )}
          </div>
        )}

        {/* СТРАНИЦА ПОЛЬЗОВАТЕЛЯ */}
        {page === "user" && viewingUser && (
          <UserPage address={viewingUser} account={account} myVotes={myVotes} onVote={handleVote} onBack={() => setPage("feed")} />
        )}

        {/* РЕЙТИНГИ */}
        {page === "ratings" && (
          <div style={{ padding: "1rem" }}>
            <div style={{ color: "#f3f4f6", fontWeight: 800, fontSize: "1.2rem", marginBottom: "1.5rem" }}>🏆 Рейтинги</div>

            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "1rem", textAlign: "center" }}>Участников в сети: <span style={{ color: "#00c4a0", fontWeight: 700 }}>{totalUsers}</span></div>

            <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.95rem" }}>🪙 Топ по SHEVELEV</div>
            {topByTokens.map((u, i) => (
              <div key={u.address} onClick={() => openUser(u.address)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 0", borderBottom: "1px solid #1f1f1f", cursor: "pointer" }}>
                <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7f32" : "#4b5563", fontWeight: 700, width: "24px", fontSize: "0.9rem" }}>#{i+1}</span>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{AVATARS[u.avatar_index || 0]?.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f3f4f6", fontSize: "0.9rem", fontWeight: 600 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{(u.shevelev || 0).toLocaleString()} SHEVELEV</div>
                </div>
              </div>
            ))}

            <div style={{ color: "#c084fc", fontWeight: 700, margin: "1.5rem 0 0.75rem", fontSize: "0.95rem" }}>⭐ Топ по голосам</div>
            {topByVotes.map((u, i) => (
              <div key={u.address} onClick={() => openUser(u.address)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 0", borderBottom: "1px solid #1f1f1f", cursor: "pointer" }}>
                <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7f32" : "#4b5563", fontWeight: 700, width: "24px", fontSize: "0.9rem" }}>#{i+1}</span>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{AVATARS[u.avatar_index || 0]?.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f3f4f6", fontSize: "0.9rem", fontWeight: 600 }}>{u.nickname || u.address.slice(0,8)+"..."}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>⭐ {u.vote_count || 0} голосов</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ДИСКЛЕЙМЕР */}
        {page === "disclaimer" && (
          <div style={{ padding: "1.5rem 1rem" }}>
            <div style={{ color: "#f3f4f6", fontWeight: 800, fontSize: "1.2rem", marginBottom: "1.5rem" }}>⚠️ Дисклеймер</div>
            <div style={{ color: "#9ca3af", lineHeight: 1.8, fontSize: "0.95rem" }}>
              <p style={{ marginBottom: "1rem" }}>Amanita Network — открытая децентрализованная платформа для обмена личным опытом с Amanita muscaria исключительно в странах где это законно.</p>
              <p style={{ marginBottom: "1rem" }}>Платформа не занимается продажей, рекламой или пропагандой каких-либо веществ.</p>
              <p style={{ marginBottom: "1rem" }}>Перед любым использованием проконсультируйтесь с врачом.</p>
              <p style={{ color: "#ef4444", fontWeight: 700 }}>⛔ Запрещено для лиц до 18 лет.</p>
            </div>
          </div>
        )}

      </div>

      {/* НИЖНЯЯ НАВИГАЦИЯ */}
      <div style={S.bottomNav}>
        <div style={{ maxWidth: "620px", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", margin: "0 auto" }}>
          <button onClick={() => navigate("feed")} style={S.navBtn}>{Icon.home(page === "feed")}</button>
          <button onClick={() => navigate("search")} style={S.navBtn}>{Icon.search(page === "search")}</button>
          <button onClick={() => account ? setShowCompose(true) : modal.open()} style={{ ...S.navBtn, background: "#f3f4f6", borderRadius: "14px", width: "48px", height: "36px", color: "#0a0a0a" }}>{Icon.compose()}</button>
          <button onClick={() => navigate("ratings")} style={S.navBtn}>{Icon.star(page === "ratings")}</button>
          <button onClick={() => navigate("profile")} style={S.navBtn}>{Icon.user(page === "profile")}</button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "1rem", color: "#1f1f1f", fontSize: "0.7rem" }}>
        ⚠️ Только для легального личного опыта · Не реклама · Консультируйтесь с врачом
      </div>
    </div>
  );
}
