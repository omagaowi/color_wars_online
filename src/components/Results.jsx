import { useEffect, useRef, useState } from "react";
import "../styles/results.css";
import { newAlert } from "./Alerts";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/online/authStore";

const Results = ({ eliminated, twoVtwo, online }) => {
  const [results, setResults] = useState(false);
  const [fade, setFade] = useState(true);
  const resultsRef = useRef(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    setIsConnected(false);
  }, []);

  console.log(results);

  const getPrefix = (position) => {
    switch (position) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      case 4:
        return "th";
    }
  };
  useEffect(() => {
    let dummyResults = [...eliminated];
    // console.log(dummyResults)
    if (twoVtwo) {
      dummyResults = dummyResults.map((el) => ({
        player: twoVtwo ? el.player : el,
        partner: twoVtwo ? el.partner : false,
        show: false,
      }));
    } else {
      if (online) {
        dummyResults = dummyResults.map((el) => ({
          player: el.color.color,
          playerID: el.playerID,
          playerName: el.name,
          partner: twoVtwo ? el.partner : false,
          show: false,
        }));
      } else {
        dummyResults = dummyResults
          .map((el) => ({
            player: twoVtwo ? el.player : el,
            partner: twoVtwo ? el.partner : false,
            show: false,
          }))
          .reverse();
      }
    }
    console.log(dummyResults);
    setResults((prev) => dummyResults);
    console.log(dummyResults);
    const fadeTimeout = setTimeout(() => {
      setFade((prev) => false);
      dummyResults.forEach((player, index) => {
        const thisPlayer =
          resultsRef.current.querySelectorAll(".results-player")[index];
        setTimeout(() => {
          thisPlayer.classList.add("show");
        }, (index + 1) * 400);
      });
    }, 500);
    return () => clearTimeout(fadeTimeout);
  }, []);
  return (
    <>
      {results ? (
        <div
          className={`results ${online ? "online" : ""} ${fade ? "fade" : ""}`}
        >
          <div
            className={`results-grid player${eliminated.length}mode`}
            ref={resultsRef}
          >
            {results.map((elem, index) => (
              <div
                className={`results-player player-${
                  !twoVtwo ? elem.player : `${elem.player}-${elem.partner}`
                } ${elem.show ? "show" : ""}`}
              >
                <div className={`position ${twoVtwo ? "twoVtwo" : ""}`}>
                  <h5>
                    {index + 1}
                    {getPrefix(index + 1)}
                  </h5>
                </div>
                {online ? (
                  <p className={`result-p-name`}>{elem.playerName}</p>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div className="results-actions">
            {!online ? (
              <>
                <button
                  onClick={() => {
                    navigate("/options/8537");
                  }}
                >
                  End Game
                </button>
              </>
            ) : (
              <>
                {!currentRoom ? (
                  <></>
                ) : (
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
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Results;
