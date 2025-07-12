import { useEffect } from "react";
import CircularLoader from "../components/CircularLoader";
import Results from "../components/Results";
import "../styles/gameStyles/onlineResults.css";
import { rootURI, useAuthStore } from "../utils/online/authStore";
import useFetch from "../utils/online/useFetch";

const OnlineResults = () => {
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
    isConnected: state.isConnected,
    setIsConnected: state.setIsConnected,
    setGameResults: state.setGameResults,
    gameResults: state.gameResults,
    updateIsAdmin: state.updateIsAdmin,
  }));
  const fetchResults = () => {
    const gameID = window.location.href.split("/")[5];
    const url = `${rootURI}/game/result/${gameID}`;
    const headers = {};
    useFetch(url, false, headers, "get")
      .then(({ data, error }) => {
        console.log(data, error);
        setGameResults(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (gameResults.length <= 0) {
      fetchResults();
    }
  }, []);

  return (
    <div className="online-results">
      {gameResults.length > 0 ? (
        <Results eliminated={gameResults} online={true} />
      ) : (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularLoader size={80} color="#fff" />
          <p style={{ color: "white", marginTop: "20px" }}>
            Fetching game results...
          </p>
        </div>
      )}
    </div>
  );
};

export default OnlineResults;
