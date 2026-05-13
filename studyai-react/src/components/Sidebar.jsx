function SideBar({ chats, nuevoChat }) {

  return (
    <div className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">📚</div>
        <h1>Study<span>AI</span></h1>
      </div>

      <button className="btn-new-chat" onClick={nuevoChat}>
        <span className="icon-plus">+</span>
        Nuevo chat
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
              title={chat}
            >
              💭 {chat.length > 35 ? chat.substring(0, 35) + "..." : chat}
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default SideBar