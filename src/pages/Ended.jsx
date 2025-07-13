import { useEffect } from "react";
import "../styles/optionStyles/server.css";
import { useAuthStore } from "../utils/online/authStore";

const EndedGame = () => {
  const {
    userData,
    updateUserData,
    isAdmin,
    updateIsAdmin,
    clientSocket,
    currentRoom,
    updateCurrentRoom,
    isConnected,
    setIsConnected,
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
    isConnected: state.isConnected,
    setIsConnected: state.setIsConnected,
    updateIsAdmin: state.updateIsAdmin,
  }));

  useEffect(() => {
    setIsConnected(false)
    updateCurrentRoom(false);
    updateCurrentRoomPlayers(false);
    updateIsAdmin(false);
    updateUserData({
      ...userData,
      room: {
        roomID: false,
        roomUID: false,
        joined: false,
      },
    });
  }, []);

  return (
    <div className="server-wait-container">
      <h1>This Game has Ended!!</h1>
      <p>Thank you for playing. Try joining another game</p>
      <div className="buttons">
        <button>New Game</button>
      </div>
    </div>
  );
};

export default EndedGame;
