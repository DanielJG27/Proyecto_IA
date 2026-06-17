import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

function SideBar({ chats, nuevoChat, setView, activeView }) {
  const { logout } = useAuth();

  return (
    <div className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">
          <img src={logo} alt="Logo" className="brand-logo-img" />
        </div>
        <h1>Learnsync<span>AI</span></h1>
      </div>

      <div className="sidebar-nav">
        <button className={`sidebar-btn ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <span className="btn-icon">📊</span>
          <span className="btn-text">Dashboard</span>
        </button>

        <button className={`sidebar-btn ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
          <span className="btn-icon">💬</span>
          <span className="btn-text">IA Tutor</span>
        </button>

        <button className={`sidebar-btn ${activeView === 'flashcards' ? 'active' : ''}`} onClick={() => setView('flashcards')}>
          <span className="btn-icon">🃏</span>
          <span className="btn-text">Flashcards IA</span>
        </button>

        <button className={`sidebar-btn ${activeView === 'pomodoro' ? 'active' : ''}`} onClick={() => setView('pomodoro')}>
          <span className="btn-icon">🍅</span>
          <span className="btn-text">Pomodoro</span>
        </button>

        <button className={`sidebar-btn ${activeView === 'goals' ? 'active' : ''}`} onClick={() => setView('goals')}>
          <span className="btn-icon">🎯</span>
          <span className="btn-text">Mis Metas</span>
        </button>

        <button className={`sidebar-btn ${activeView === 'achievements' ? 'active' : ''}`} onClick={() => setView('achievements')}>
          <span className="btn-icon">🏆</span>
          <span className="btn-text">Logros</span>
        </button>
      </div>

      <div className="sidebar-divider"></div>

      {activeView === 'chat' && (
        <button className="btn-new-chat" onClick={nuevoChat}>
          <span className="icon-plus">+</span>
          Nuevo chat
        </button>
      )}

      <span className="sidebar-section-title">Historial Chat</span>

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
              💭 {chat.prompt && chat.prompt.length > 25 ? chat.prompt.substring(0, 25) + "..." : chat.prompt}
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export default SideBar;