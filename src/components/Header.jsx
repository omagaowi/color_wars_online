import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/online/authStore";

const Header = () => {
  const location = useLocation();

  const {
    userData,
    updateUserData,
    isAdmin,
    updateIsAdmin,
    clientSocket,
    currentRoom,
    updateCurrentRoom,
    isConnected,
    showUserList,
    setShowUserList,
    gameResults,
    setGameResults,
    setIsConnected,
    currentRoomPlayers,
    showShare,
    setShowShare,
    updateCurrentRoomPlayers,
  } = useAuthStore((state) => ({
    showUserList: state.showUserList,
    setShowUserList: state.setShowUserList,
    userData: state.userData,
    updateUserData: state.updateUserData,
    currentRoom: state.currentRoom,
    currentRoomPlayers: state.currentRoomPlayers,
    updateCurrentRoom: state.updateCurrentRoom,
    updateCurrentRoomPlayers: state.updateCurrentRoomPlayers,
    clientSocket: state.clientSocket,
    isAdmin: state.isAdmin,
    showShare: state.showShare,
    setShowShare: state.setShowShare,
    isConnected: state.isConnected,
    setIsConnected: state.setIsConnected,
    setGameResults: state.setGameResults,
    gameResults: state.gameResults,
    updateIsAdmin: state.updateIsAdmin,
  }));

  const navigate = useNavigate();

  return (
    <header>
      <h1
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        colorwars
      </h1>
      {location.pathname.includes("lobby") && isConnected ? (
        <button onClick={ () => {
          setShowShare(true)
        } }>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-share-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
          </svg>
          Invite Players{" "}
        </button>
      ) : (
        <></>
      )}
    </header>
  );
};

export default Header;
