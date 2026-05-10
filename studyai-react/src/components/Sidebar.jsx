function SideBar({ chats, nuevoChat }){

    return (
        <div className="sidebar">

            <h2>StudyAI</h2>

        <button onClick={nuevoChat}>
            + Nuevo chat
        </button>

       <div id="historial">

        {chats.map((chat, index) => (
          <div
            key={index}
            style={{ marginBottom: "10px" }}
          >
            {chat}
          </div>
        ))}

      </div>

    </div>
  )
}

export default SideBar