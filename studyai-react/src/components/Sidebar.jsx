import { useAuth } from '../context/AuthContext';

function SideBar({ chats, nuevoChat, setView }) {
  const { logout } = useAuth();

  return (
    <div className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">📚</div>
        <h1>Study<span>AI</span></h1>
      </div>

      <button className="btn-new-chat" onClick={() => {
        nuevoChat();
        setView('chat');
      }}>
        <span className="icon-plus">+</span>
        Nuevo chat
      </button>

      <button className="btn-dashboard" onClick={() => setView('dashboard')}>
        <span className="icon-dashboard">📊</span>
        Mi Dashboard
      </button>

      <div className="sidebar-divider"></div>

      <span className="sidebar-section-title">Historial</span>

      <div id="historial">
        {chats.length === 0 ? (
          <div className="historial-empty">
            <span className="empty-icon">💬</span>
            <span>Tus conversaciones aparecerán aquí</span>
          </div>
        ) : (
          chats.map((chat, index) => (
            <div
              key={index}
              className="historial-item"
              title={chat.prompt}
              onClick={() => setView('chat')}
            >
              💭 {chat.prompt && chat.prompt.length > 35 ? chat.prompt.substring(0, 35) + "..." : chat.prompt}
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={logout}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export default SideBar;