import "../styles/userLIst.css";
import { useAuthStore } from "../utils/online/authStore";

const UserList = () => {
  const {
    userData,
    updateUserData,
    isAdmin,
    showUserList,
    setShowUserList,
    updateIsAdmin,
    clientSocket,
    currentRoom,
    updateCurrentRoom,
    currentRoomPlayers,
    updateCurrentRoomPlayers,
  } = useAuthStore((state) => ({
    userData: state.userData,
    updateUserData: state.updateUserData,
    currentRoom: state.currentRoom,
    currentRoomPlayers: state.currentRoomPlayers,
    updateCurrentRoom: state.updateCurrentRoom,
    updateCurrentRoomPlayers: state.updateCurrentRoomPlayers,
    clientSocket: state.clientSocket,
    isAdmin: state.isAdmin,
    updateIsAdmin: state.updateIsAdmin,
    showUserList: state.showUserList,
    setShowUserList: state.setShowUserList,
  }));
  // console.log(currentRoomPlayers)
  return (
    <div className={`userlist-modal ${showUserList ? "show" : ""}`}>
      <div className="userlist-heading">
        <h2>Current Players({currentRoomPlayers.length})</h2>
      </div>
      <div className="users-list">
        {currentRoomPlayers.map((player) => (
          <div className="user">
            <div
              className="circle"
              style={{
                background: `${player.color.code}`,
              }}
            ></div>
            <div className="user-text">
              <h3>{player.name}</h3>
              <h6
                style={{
                  color: player.status == "online" ? "green" : "red",
                }}
              >
                {player.status}{" "}
              </h6>
            </div>
          </div>
        ))}
      </div>
      <div className="userlist-actions">
        <button
          onClick={() => {
            clientSocket.emit("leave", {
              roomID: currentRoom.roomID,
            });
            newAlert({
              type: "error",
              users: [userData],
              message: `you left`,
              color: "red",
            });
            navigate("/joinroom");
          }}
        >
          Leave Game
        </button>
        {isAdmin ? (
          <button
            onClick={() => {
              clientSocket.emit("endGame", {
                room: currentRoom,
                player: userData,
              });
              setShowUserList(false);
            }}
          >
            End Game
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserList;
