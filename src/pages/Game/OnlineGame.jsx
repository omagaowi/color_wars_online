import { useEffect, useState } from "react";
import Grid from "../../components/GridArea.jsx";
import Loader from "../../components/Loader.jsx";
import "../../styles/gameStyles/gameStyles.css";
import { generateGrid } from "../../utils/generateGrid.js";

import {
  useMenuStore,
  useGridStore,
  useEliminatedStore,
  root,
} from "../../utils/mainStore.js";
import Results from "../../components/Results.jsx";
import GameError from "../../components/GameError.jsx";
import GameHeading from "../../components/GameHeading.jsx";
import { gameDataStore } from "../../utils/online/otherStores.jsx";
import { useAuthStore } from "../../utils/online/authStore.jsx";
import { newAlert } from "../../components/Alerts.jsx";
import UserList from "../../components/UserList.jsx";
import OnClickOutside from "../../components/OnClickOutside.jsx";
import { useNavigate } from "react-router-dom";

// let boxClick
let boxClickOnline;
let handlePlay;
let handlePlayerDisconnect;
let handleTimeout;
let changeTimout;
let handleEnded;
let handleResults;

const OnlineGame = () => {
  const { mode, setMode, playerCount, setPlayerCount } = useMenuStore(
    (state) => ({
      mode: state.mode,
      setMode: state.setMode,
      playerCount: state.playerCount,
      setPlayerCount: state.setPlayerCount,
    })
  );

  const { boxes, setBoxes } = useGridStore((state) => ({
    boxes: state.boxes,
    setBoxes: state.setBoxes,
  }));

  const { gameData, updateGameData } = gameDataStore((state) => ({
    gameData: state.gameData,
    updateGameData: state.updateGameData,
  }));

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

  const { eliminated, setEliminated } = useEliminatedStore((state) => ({
    eliminated: state.eliminated,
    setEliminated: state.setEliminated,
  }));

  let turnInterval = false;

  const navigate = useNavigate();

  const [grid, setGrid] = useState(false);
  const [initialPlays, setInitialPlays] = useState({
    blue: false,
    red: false,
    green: false,
    yellow: false,
  });
  const [playOrder, setPlayOrder] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [playTurn, setPlayTurn] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  let time;

  // console.log(playOrder, grid)

  const determineRebound = (row, columnNo) => {
    const rebounds = [
      {
        row: row - 1,
        column: columnNo,
      },
      {
        row: row,
        column: columnNo + 1,
      },
      {
        row: row + 1,
        column: columnNo,
      },
      {
        row: row,
        column: columnNo - 1,
      },
    ];
    return rebounds;
  };

  const getPlayerTurn = () => {
    // console.log(currentRoom)
    console.log(currentRoomPlayers);
    const player = currentRoomPlayers.find(function (el) {
      return el.color.color == gameData.playOrder[playTurn];
    });
    // console.log(gameData)
    return player;
  };

  const checkInitialPlays = (player) => {
    if (player == "blue") {
      return initialPlays.blue;
    } else if (player == "red") {
      return initialPlays.red;
    } else if (player == "green") {
      return initialPlays.green;
    } else {
      return initialPlays.yellow;
    }
  };

  const removeInitialPlays = (player) => {
    const dummyPlays = initialPlays;
    if (player == "blue") {
      dummyPlays.blue = true;
      setInitialPlays((prev) => dummyPlays);
    } else if (player == "red") {
      dummyPlays.red = true;
      setInitialPlays((prev) => dummyPlays);
    } else if (player == "green") {
      dummyPlays.green = true;
      setInitialPlays((prev) => dummyPlays);
    } else {
      dummyPlays.yellow = true;
      setInitialPlays((prev) => dummyPlays);
    }
  };

  const chosen = (rowNo, columnNo, index, player, rootCell) => {
    // console.log(rowNo, columnNo)
    const thisBox = boxes.filter(function (el) {
      return el.row == rowNo && el.column == columnNo;
    })[0];

    if (thisBox.circles >= 4) {
      const dummyBoxes = boxes;
      const thisIndex = dummyBoxes.indexOf(thisBox);
      dummyBoxes[thisIndex].player = [player];
      dummyBoxes[thisIndex].circles = 0;
      dummyBoxes[thisIndex].player = [];
      setBoxes(dummyBoxes);
      setTimeout(() => {
        // setCirclesDOM(0, rowNo, columnNo)
        determineRebound(rowNo, columnNo).forEach((bound, index) => {
          if (
            bound.row < 1 ||
            bound.column < 1 ||
            bound.row > grid.length ||
            bound.column > grid.length
          ) {
            // if the rebound is outside the grid just ignore
          } else {
            const chosenBox = boxes.filter(function (el) {
              return el.row == bound.row && el.column == bound.column;
            })[0];
            const dummyBoxes = boxes;
            const thisIndex = dummyBoxes.indexOf(chosenBox);
            dummyBoxes[thisIndex].player = [player];
            dummyBoxes[thisIndex].circles = chosenBox.circles + 1;
            sessionStorage.setItem(
              "lastPlay",
              JSON.stringify({
                timestamp: Date.now(),
              })
            );
            setBoxes(dummyBoxes);
            setTimeout(() => {
              chosen(
                bound.row,
                bound.column,
                index,
                player,
                `${columnNo}_${rowNo}`
              );
            }, 700);
          }
        });
      }, 0);
    } else {
      sessionStorage.setItem(
        "lastPlay",
        JSON.stringify({
          timestamp: Date.now(),
        })
      );
    }
  };

  const checkPlayerScore = (player) => {
    if (boxes) {
      const playerBoxes = boxes.filter(function (el) {
        return el.player.includes(player);
      });
      return playerBoxes.length;
    }
  };

  console.log(currentRoomPlayers);

  console.log(playOrder);

  const eliminatePlayers = () => {
    if (playOrder) {
      playOrder.forEach((player) => {
        const getUser = currentRoomPlayers.find(function (el) {
          return el.color.color == player;
        });
        if (
          checkPlayerScore(player) == 0 ||
          (getUser && getUser.status == "offline")
        ) {
          if (checkInitialPlays(player)) {
            if (checkPlayerScore(player) == 0) {
              if (!eliminated.includes(player)) {
                setEliminated(player);
              }
            }
          } else {
            if (getUser && getUser.status == "offline") {
              if (!eliminated.includes(player)) {
                setEliminated(player);
              }
            }
          }
        }
      });
    }
  };

  const checkFirstPlace = (player) => {
    const playerBoxes = boxes.filter(function (el) {
      return el.player.includes(player);
    });
    const occupiedBoxes = boxes.filter(function (el) {
      return el.player.length != 0;
    });
    if (playerBoxes.length == occupiedBoxes.length) {
      return true;
    } else {
      return false;
    }
  };

  // const gameTimer = setInterval(() => {
  //   setTimer(prev => prev += 1)
  //   clearInterval(gameTimer)
  // }, 1000)

  // console.log(timer)

  const emitTimeout = async () => {
    try {
      const data = {
        player: userData,
        room: currentRoom,
        box: false,
        turn: playOrder[playTurn],
      };
      clientSocket.emit("timeout", data);
    } catch (error) {
      throw error;
    }
  };

  const emitPlay = async (thisBox) => {
    try {
      const data = {
        player: userData,
        room: currentRoom,
        box: thisBox,
        turn: playOrder[playTurn],
      };
      clientSocket.emit("play", data);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const emitElimination = async () => {
    try {
      const data = {
        player: userData,
        room: currentRoom,
        box: false,
        turn: playOrder[playTurn],
      };
      clientSocket.emit("elimination", data);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // boxClick = (thisBox) => {
  //     if(!hasPlayed){
  //         const player = playOrder[playTurn]
  //         if(thisBox.player.length == 0){
  //           if(checkInitialPlays(player)){

  //           }else{
  //             const dummyBoxes = boxes
  //             const thisIndex = dummyBoxes.indexOf(thisBox)
  //             dummyBoxes[thisIndex].player = [player]
  //             dummyBoxes[thisIndex].circles = 3
  //             setBoxes(dummyBoxes)
  //             removeInitialPlays(player)
  //             setHasPlayed(prev => true)
  //             setTimeout(() => {
  //               chosen(thisBox.row, thisBox.column, 0, player, false)
  //             }, 700);
  //           }
  //         }else{
  //           if(thisBox.player.includes(playOrder[playTurn])){
  //               const dummyBoxes = boxes
  //               const thisIndex = dummyBoxes.indexOf(thisBox)
  //               dummyBoxes[thisIndex].player = [player]
  //               dummyBoxes[thisIndex].circles += 1;
  //               setBoxes(dummyBoxes)
  //               setHasPlayed(prev => true)
  //               setTimeout(() => {
  //                 chosen(thisBox.row, thisBox.column, 0, player, false)
  //               }, 700);
  //           }
  //         }
  //       }
  // }

  boxClickOnline = (thisBox) => {
    if (getPlayerTurn().playerID == userData.playerID) {
      const player = playOrder[playTurn];
      if (thisBox.player.length == 0) {
        if (checkInitialPlays(player)) {
        } else {
          setHasPlayed((prev) => true);
          // setPlayLoading(true)
          emitPlay(thisBox)
            .then(() => {})
            .catch((err) => {
              setHasPlayed((prev) => false);
              // setPlayLoading(false)
            });
        }
      } else {
        if (thisBox.player.includes(playOrder[playTurn])) {
          //play
          setHasPlayed((prev) => true);
          //  setPlayLoading(true)
          emitPlay(thisBox)
            .then(() => {
              // setPlayLoading(false)
            })
            .catch((err) => {
              setHasPlayed((prev) => false);
              // setPlayLoading(false)
            });
        }
      }
    }
  };

  const cachingEvents = (box, turn) => {
    let cachedEvents = JSON.parse(localStorage.getItem("cachedEvents"));
    const thisEvent = cachedEvents.find(function (el) {
      return el.color == turn;
    });
    cachedEvents[cachedEvents.indexOf(thisEvent)].box = box;
    localStorage.setItem("cachedEvents", JSON.stringify(cachedEvents));
    // console.log(cachedEvents)
  };

  const getCachedEvent = (turn) => {
    const cachedEvents = JSON.parse(localStorage.getItem("cachedEvents"));
    const thisEvent = cachedEvents.find(function (el) {
      return el.color == turn;
    });
    return thisEvent;
  };

  // console.log(eliminated)

  handlePlay = (data) => {
    // console.log(data)
    // console.log(data.box)
    if (currentRoom && isConnected) {
      if (!showLoader) {
        if (getPlayerTurn().playerID == data.player.playerID) {
          playLogic(data.box);
          cachingEvents(false, data.turn);
        } else {
          //cache event
          cachingEvents(data.box, data.turn);
        }
      } else {
        //cache event
        cachingEvents(data.box, data.turn);
      }
    }
  };

  handleTimeout = (data) => {
    if (!showLoader) {
      if (getPlayerTurn().playerID == data.player.playerID) {
        newAlert({
          type: "warning",
          users: [getPlayerTurn()],
          message:
            getPlayerTurn().playerID == userData.playerID
              ? "your time ran out"
              : `${getPlayerTurn().name}'s time ran out!`,
          color: getPlayerTurn().color.color,
        });
        cachingEvents(false, data.turn);
        clearTimeout(changeTimout);
        changeTimout = setTimeout(() => {
          setPlayTurn((prev) =>
            prev >= playerCount.count - 1 ? 0 : (prev += 1)
          );
        }, 1200);
      } else {
        //cache event
        cachingEvents("timeout", data.turn);
      }
    } else {
    }
  };

  handlePlayerDisconnect = (data) => {
    if (currentRoom && isConnected && currentRoom.roomID == data.room.roomID) {
      if (data.action == "left") {
        // console.log(data)
        updateCurrentRoom(data.room);
        updateCurrentRoomPlayers(data.players);
        if (data.player.playerID == userData.playerID) {
          // setLoading(prev => false)
          updateUserData(data.player);
          newAlert({
            type: data.action == "joined" ? "success" : "error",
            users: [data.user],
            message: `you ${data.action}`,
            color: data.action == "joined" ? "green" : "red",
          });
        } else {
          newAlert({
            type: data.action == "joined" ? "success" : "error",
            users: [data.player],
            message: `${data.player.name} ${data.action}`,
            color: data.action == "joined" ? "green" : "red",
          });
        }
        updateIsAdmin(
          data.players[0].playerID == userData.playerID ? true : false
        );
        console.log(getPlayerTurn());
        if (getPlayerTurn().playerID == data.player.playerID) {
          const disconnectTimeout = setTimeout(() => {
            setPlayTurn((prev) =>
              prev >= playerCount.count - 1 ? 0 : (prev += 1)
            );
            clearTimeout(disconnectTimeout);
          }, 1000);
        }
      }
    }
  };

  handleResults = (data) => {
    if (currentRoom && isConnected) {
      console.log("hanlde");
      setTimeout(() => {
        newAlert({
          type: "warning",
          users: [],
          message: "the game has finished",
          color: "yellow",
        });
        setTimeout(() => {
          setGameResults(data.results);
          console.log(data.results);
          // clientSocket.off('ended')
          // clientSocket.off('users')
          // clientSocket.off('play')
          clientSocket.emit("leave", {
            roomID: currentRoom.roomID,
          });
          // clientSocket.off('timeout')
          navigate(`/game/results/${currentRoom.roomID}`);
        }, 1000);
      }, 2000);
    }
  };

  const playLogic = (box) => {
    console.log(box);
    const thisBox = boxes.find(function (el) {
      return el.row == box.row && el.column == box.column;
    });
    const player = playOrder[playTurn];
    if (thisBox.player.length == 0) {
      if (checkInitialPlays(player)) {
      } else {
        const dummyBoxes = boxes;
        const thisIndex = dummyBoxes.indexOf(thisBox);
        dummyBoxes[thisIndex].player = [player];
        dummyBoxes[thisIndex].circles = 3;
        setBoxes(dummyBoxes);
        removeInitialPlays(player);
        setTimeout(() => {
          chosen(thisBox.row, thisBox.column, 0, player, false);
        }, 700);
      }
    } else {
      if (thisBox.player.includes(playOrder[playTurn])) {
        const dummyBoxes = boxes;
        const thisIndex = dummyBoxes.indexOf(thisBox);
        dummyBoxes[thisIndex].player = [player];
        dummyBoxes[thisIndex].circles += 1;
        //   console.log(dummyBoxes[thisIndex].circles += 1)
        setBoxes(dummyBoxes);
        setTimeout(() => {
          chosen(thisBox.row, thisBox.column, 0, player, false);
        }, 700);
      }
    }
  };

  useEffect(() => {
    if (timer < 15) {
      // time = setTimeout(() => setTimer(prev => prev += 0.2), 200)
      if (hasPlayed) {
        clearTimeout(time);
      }
      return () => clearTimeout(time);
    } else {
      if (getPlayerTurn() && getPlayerTurn().playerID == userData.playerID) {
        // emitTimeout().then(() => {
        // }).catch(() => {
        // })
        // console.log('timeout')
      }
    }
  }, [timer]);

  console.log(currentRoom);

  handleEnded = (msg) => {
    if (currentRoom) {
      setTimeout(() => {
        newAlert({
          type: "warning",
          users: [],
          message: msg,
          color: "yellow",
        });
        setTimeout(() => {
          // clientSocket.off('ended')
          // clientSocket.off('users')
          // clientSocket.off('play')
          clientSocket.emit("leave", {
            roomID: currentRoom.roomID,
          });
          // clientSocket.off('timeout')
          navigate(`/ended/${currentRoom.roomID}`);
        }, 1000);
      }, 2000);
    }
  };

  useEffect(() => {
    if (
      currentRoom &&
      gameData &&
      userData &&
      currentRoomPlayers.length > 0 &&
      isConnected
    ) {
      if (currentRoomPlayers[0].playerID == userData.playerID) {
        if (eliminated.length == currentRoomPlayers.length) {
          clientSocket.emit("resultEnd", {
            room: currentRoom,
            eliminated: eliminated,
          });
        }
      } else {
      }
    }
  }, [eliminated]);

  useEffect(() => {
    clearTimeout(changeTimout);
    if (gameData) {
      sessionStorage.removeItem("lastPlay");
      if (getPlayerTurn().status == "online") {
        setHasPlayed((prev) => false);
        if (turnInterval) {
          clearInterval(turnInterval);
        }

        eliminatePlayers();
        if (checkInitialPlays(playOrder[playTurn])) {
          if (checkFirstPlace(playOrder[playTurn])) {
            if (!eliminated.includes(playOrder[playTurn])) {
              setEliminated(playOrder[playTurn]);
              // setGameEnded(prev => true)
            } else {
              // setGameEnded(prev => true)
            }
          }
        }

        if (showLoader == false) {
          // setTimer(prev => 0)

          // if(getPlayerTurn().playerID == userData.playerID){
          //   setTimer(prev => 0)
          // }
          newAlert({
            type: "turn",
            users: [getPlayerTurn()],
            message:
              getPlayerTurn().playerID == userData.playerID
                ? "your turn!"
                : `${getPlayerTurn().name}'s turn!`,
            color: getPlayerTurn().color.color,
          });

          if (getCachedEvent(gameData.playOrder[playTurn]).box) {
            if (getCachedEvent(gameData.playOrder[playTurn]).box == "timeout") {
              // playLogic(getCachedEvent(gameData.playOrder[playTurn]).box)
              newAlert({
                type: "warning",
                users: [getPlayerTurn()],
                message:
                  getPlayerTurn().playerID == userData.playerID
                    ? "your time ran out"
                    : `${getPlayerTurn().name}'s time ran out!`,
                color: getPlayerTurn().color.color,
              });
              cachingEvents(false, data.turn);
              changeTimout = setTimeout(() => {
                setPlayTurn((prev) =>
                  prev >= playerCount.count - 1 ? 0 : (prev += 1)
                );
              }, 1200);
            } else {
              playLogic(getCachedEvent(gameData.playOrder[playTurn]).box);
            }

            cachingEvents(false, gameData.playOrder[playTurn]);
          }
        }

        if (
          checkPlayerScore(playOrder[playTurn]) == 0 &&
          checkInitialPlays(playOrder[playTurn])
        ) {
          setPlayTurn((prev) =>
            prev >= playerCount.count - 1 ? 0 : (prev += 1)
          );
        } else {
          turnInterval = setInterval(() => {
            if (sessionStorage.getItem("lastPlay")) {
              const diff =
                Date.now() -
                JSON.parse(sessionStorage.getItem("lastPlay")).timestamp;
              if (diff > 1500) {
                console.log(playerCount.count - 1);
                setPlayTurn((prev) =>
                  prev >= playerCount.count - 1 ? 0 : (prev += 1)
                );
                clearInterval(turnInterval);
              }
            }
          }, 1000);
        }
      } else {
        setPlayTurn((prev) =>
          prev >= playerCount.count - 1 ? 0 : (prev += 1)
        );
      }
    }
  }, [playTurn]);

  useEffect(() => {
    if (!showLoader) {
      newAlert({
        type: "turn",
        users: [getPlayerTurn()],
        message:
          getPlayerTurn().playerID == userData.playerID
            ? "your turn!"
            : `${getPlayerTurn().name}'s turn!`,
        color: getPlayerTurn().color.color,
      });
      if (getPlayerTurn().playerID == userData.playerID) {
        setTimer((prev) => 0);
      }

      if (getCachedEvent(gameData.playOrder[playTurn]).box) {
        playLogic(getCachedEvent(gameData.playOrder[playTurn]).box);
        cachingEvents(false, gameData.playOrder[playTurn]);
      }
    }
  }, [showLoader]);

  useEffect(() => {
    if (gameData) {
      localStorage.setItem(
        "cachedEvents",
        JSON.stringify([
          {
            color: "blue",
            box: false,
          },
          {
            color: "red",
            box: false,
          },
          {
            color: "green",
            box: false,
          },
          {
            color: "yellow",
            box: false,
          },
        ])
      );
      setPlayOrder(gameData.playOrder);
      setGrid(gameData.playGrid);
      setMode("online");
      setPlayerCount({
        tvt: false,
        count: gameData.playOrder.length,
      });
    }
  }, []);

  // console.log('user', getPlayerTurn(), playTurn , userData.playerID)

  return (
    <>
      {playerCount &&
      gameData &&
      userData &&
      currentRoom &&
      currentRoomPlayers.length > 0 && isConnected && isConnected == currentRoom.roomID? (
        <>
          <div
            className={`game-container ${playOrder[playTurn]}`}
            style={{ position: gameEnded ? "fixed" : "relative" }}
          >
            {/* <GameHeading color = { playOrder[playTurn] } players = { [] } timer = { timer }/> */}
            <Grid
              playTurn={playTurn}
              playOrder={playOrder}
              hasPlayed={hasPlayed}
              initialPlays={initialPlays}
              grid={grid}
            />
            {showLoader ? (
              <Loader
                setLoader={setShowLoader}
                firstPlay={playOrder.length > 0 ? playOrder[0] : false}
                playerCount={playerCount.count}
              />
            ) : (
              <>
                <GameHeading
                  color={playOrder[playTurn]}
                  players={currentRoomPlayers}
                  timer={timer}
                  isTurn={false}
                />
              </>
            )}
            <OnClickOutside
              currentState={showUserList}
              setState={setShowUserList}
            >
              <UserList />
            </OnClickOutside>
          </div>
          {gameEnded ? <Results eliminated={eliminated} /> : <></>}
        </>
      ) : (
        // <>{ timer }</>
        <GameError />
      )}
    </>
  );
};

export {
  boxClickOnline,
  handlePlay,
  handleEnded,
  handleResults,
  handlePlayerDisconnect,
  handleTimeout,
};
export default OnlineGame;
