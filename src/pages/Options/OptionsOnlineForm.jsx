import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header.jsx";
import "../../styles/optionStyles/onlineForm.css";
import { root } from "../../utils/mainStore.js";
import Error from "../../components/Error.jsx";
import LoaderRing from "../../components/LoaderRing.jsx";
import Cookies from "js-cookie";
import { alertStore } from "../../utils/online/otherStores.jsx";

import { useLocation, useNavigate } from "react-router-dom";
import { rootURI, useAuthStore } from "../../utils/online/authStore.jsx";
import { newAlert } from "../../components/Alerts.jsx";
import useFetch from "../../utils/online/useFetch.jsx";
import CircularLoader from "../../components/CircularLoader.jsx";

const OnlineForm = () => {
  const { updateUserData, userData } = useAuthStore((state) => ({
    updateUserData: state.updateUserData,
    userData: state.userData,
  }));

  const [showRoom, setShowRoom] = useState(false);
  const [name, setName] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [room, setRoom] = useState(false);

  const navigate = useNavigate();

  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQueryParams();

  const RoomForm = () => {
    const [isCreateRoom, setIsCreateRoom] = useState(false);
    const [roomID, setRoomId] = useState(false);
    const roomIdRef = useRef(false);

    const createRoom = (e) => {
      e.preventDefault();
      setLoading(true);
      const url = `${rootURI}/room/create`;
      const body = {
        roomID: roomID,
      };
      useFetch(url, body, false, "post")
        .then(({ data: createRoomData, error: createRoomError }) => {
          setLoading(false);
          if (createRoomData) {
            const newData = {
              name: name.toLowerCase(),
              playerID: !JSON.parse(localStorage.getItem("userData"))
                ? crypto.randomUUID()
                : JSON.parse(localStorage.getItem("userData")).playerID,
              status: "offline",
              room: {
                roomID: false,
                roomUID: false,
                joined: false,
              },
            };
            updateUserData(newData);
            localStorage.setItem("userData", JSON.stringify(newData));
            navigate(`/game/lobby/${createRoomData.roomID}`);
            // console.log(createRoomData)
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response) {
            newAlert({
              type: "error",
              users: [],
              message: error.response.data,
              color: "red",
            });
          } else if (error.request) {
            newAlert({
              type: "error",
              users: [],
              message: "An Error Occured!",
              color: "red",
            });
          } else {
            newAlert({
              type: "error",
              users: [],
              message: "Check your connection!",
              color: "red",
            });
          }
        });
    };

    const joinRoom = (e) => {
      e.preventDefault();
      const roomID = e.target.roomID.value;
      if (roomID) {
        const url = `${rootURI}/room/join`;
        const body = {
          roomID: roomID,
        };
        useFetch(url, body, false, "post")
          .then(({ data: createRoomData, error: createRoomError }) => {
            setLoading(false);
            if (createRoomData) {
              const newData = {
                name: name,
                playerID: !JSON.parse(localStorage.getItem("userData"))
                  ? crypto.randomUUID()
                  : JSON.parse(localStorage.getItem("userData")).playerID,
                status: "offline",
                room: {
                  roomID: false,
                  roomUID: false,
                  joined: false,
                },
              };
              updateUserData(newData);
              localStorage.setItem("userData", JSON.stringify(newData));
              navigate(`/game/lobby/${createRoomData.roomID}`);
              // console.log(createRoomData)
            } else {
              newAlert({
                type: "error",
                users: [],
                message: "An Error Occured!",
                color: "red",
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            if (error.response) {
              newAlert({
                type: "error",
                users: [],
                message: error.response.data,
                color: "red",
              });
            } else if (error.request) {
              newAlert({
                type: "error",
                users: [],
                message: "An Error Occured!",
                color: "red",
              });
            } else {
              newAlert({
                type: "error",
                users: [],
                message: "Check your connection!",
                color: "red",
              });
            }
          });
      } else {
        newAlert({
          type: "error",
          users: [],
          message: "Invalid Room ID",
          color: "red",
        });
      }
    };

    return (
      <form
        className="room-form"
        onSubmit={(e) => {
          if (isCreateRoom) {
            createRoom(e);
          } else {
            joinRoom(e);
          }
        }}
      >
        <h2>Join Room</h2>
        <div className="input-field">
          <input
            type="text"
            placeholder="Enter Room ID"
            ref={roomIdRef}
            name="roomID"
          />
          <div
            className="create-btn"
            style={{
              backgroundColor: isCreateRoom ? "#31515f" : "transparent",
            }}
            title="Create Rooom"
            onClick={() => {
              setIsCreateRoom((prev) => (prev ? false : true));
              if (!isCreateRoom) {
                const newRoomID = Number(
                  Date.now().toString().split("").splice(5, 5).join("")
                );
                setRoomId((prev) => newRoomID);
                roomIdRef.current.value = newRoomID;
                roomIdRef.current.setAttribute("readonly", "readonly");
              } else {
                roomIdRef.current.value = "";
                roomIdRef.current.removeAttribute("readonly", "readonly");
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
          </div>
        </div>
        <button style={{ pointerEvents: loading ? "none" : "all" }}>
          {!loading ? (
            <>
              <>{isCreateRoom ? <>Create Room</> : <>Join Room</>}</>
            </>
          ) : (
            <>
              <CircularLoader size={30} color="#95c1d4" />
            </>
          )}
        </button>
      </form>
    );
  };

  const NameForm = () => {
    const nameRef = useRef(false);
    const [loading, setLoading] = useState(false)
    const submitNameForm = (e) => {
      e.preventDefault();
      const player_name = e.target.player_name.value.toLowerCase();
      if (player_name != "") {
        setName((prev) => player_name);
      } else {
        newAlert({
          type: "error",
          users: [],
          message: "Enter a valid name!",
          color: "red",
        });
        // setError(prev => 'Enter name!!')
      }
    };

    const joinRoom = (e, room) => {
      // e.preventDefault()
      const roomID = room;
      if (roomID) {
        const url = `${rootURI}/room/join`;
        const body = {
          roomID: roomID,
        };
        useFetch(url, body, false, "post")
          .then(({ data: createRoomData, error: createRoomError }) => {
            setLoading(false);
            if (createRoomData) {
              const newData = {
                name: e.target.player_name.value.toLowerCase(),
                playerID: !JSON.parse(localStorage.getItem("userData"))
                  ? crypto.randomUUID()
                  : JSON.parse(localStorage.getItem("userData")).playerID,
                status: "offline",
                room: {
                  roomID: false,
                  roomUID: false,
                  joined: false,
                },
              };
              updateUserData(newData);
              localStorage.setItem("userData", JSON.stringify(newData));
              navigate(`/game/lobby/${createRoomData.roomID}`);
              // console.log(createRoomData)
            } else {
              newAlert({
                type: "error",
                users: [],
                message: "An Error Occured!",
                color: "red",
              });
            }
          })
          .catch((error) => {
            console.log(error)
            setLoading(false);
            if (error.response) {
              newAlert({
                type: "error",
                users: [],
                message: error.response.data,
                color: "red",
              });
            } else if (error.request) {
              newAlert({
                type: "error",
                users: [],
                message: "An Error Occured!",
                color: "red",
              });
            } else {
              newAlert({
                type: "error",
                users: [],
                message: "Check your connection!",
                color: "red",
              });
            }
          });
      } else {
        newAlert({
          type: "error",
          users: [],
          message: "Invalid Room ID",
          color: "red",
        });
      }
    };
    console.log(userData);
    useEffect(() => {
      if (userData && userData.name) {
        if (nameRef && nameRef.current) {
          nameRef.current.value = userData.name.toLowerCase();
          nameRef.current.focus()
        }
        // setName(userData.name.toLowerCase())
      }
    }, []);

    return (
      <form
        className="name-form"
        onSubmit={(e) => {
          if (query.get("ID")) {
            e.preventDefault();
            console.log('name', e.target.player_name.value)
            joinRoom(e, query.get("ID"));
          } else {
            submitNameForm(e);
          }
        }}
      >
        <h2>Enter Name</h2>
        <div className="input-field">
          <input
            type="text"
            name="player_name"
            ref={nameRef}
            placeholder="Enter Name..."
          />
        </div>
        {query.get("ID") ? (
          <>
            <button style={{ pointerEvents: loading ? "none" : "all" }}>
              {!loading ? (
                <>
                  <>Join Room</>
                </>
              ) : (
                <>
                  <CircularLoader size={30} color="#95c1d4" />
                </>
              )}
            </button>
          </>
        ) : (
          <button type="submit">Next</button>
        )}
      </form>
    );
  };

  useEffect(() => {
    if (query.get("ID")) {
      setRoom(query.get("ID"));
    } else {
      setRoom(false);
    }
  }, [location]);

  return (
    <div className="options-container online-form">
      <Error error={error} setError={setError} />
      {name ? <RoomForm /> : <NameForm />}
      <Header />
    </div>
  );
};

export default OnlineForm;
