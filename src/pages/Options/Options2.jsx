import { useEffect } from "react"
import Header from "../../components/Header.jsx"

import { useMenuStore, useGridStore } from "../../utils/mainStore.js"
import { useNavigate } from "react-router-dom"
import boxesGrid from "../../utils/boxes.js"
import { useAuthStore } from "../../utils/online/authStore.jsx"

const Options2 = () => {

    const { updateUserData, userData, clientSocket, setIsConnected, currentRoom } = useAuthStore((state) => ({
    updateUserData: state.updateUserData,
    clientSocket: state.clientSocket,
    userData: state.userData,
    currentRoom: state.currentRoom,
    setIsConnected: state.setIsConnected
  }));

    const navigate = useNavigate(false)
    const { mode , setMode, playerCount, setPlayerCount} = useMenuStore((state) => ({ 
        mode: state.mode,
        setMode: state.setMode,
        playerCount: state.playerCount,
        setPlayerCount: state.setPlayerCount
    }))

    const { boxes, setBoxes } = useGridStore((state) => ({
        boxes: state.boxes,
        setBoxes: state.setBoxes
    }))

    const fetchGrid = async () => {
        try {
            const response = await fetch('/boxes.json')
            const data = await response.json()
            return data
        } catch (error) {
            return error
        }
    }


    useEffect(() => {
        setBoxes([])
        fetchGrid().then(((data) => {
            setBoxes(data.boxes)
        })).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
    if (userData && userData.playerID && currentRoom && currentRoom.roomID) {
       clientSocket.emit("leave", {
        roomID: currentRoom.roomID,
      });
    }
    setIsConnected(false)
  }, [])

    return (
        <div className="options-container options2">
            <Header />
            <div className="options-pick">
                <div className="option" onClick={ () => {
                    if(boxes.length > 0){
                        const lsBoxes = JSON.parse(localStorage.getItem('boxes'))
                        if(lsBoxes){
                            setBoxes(lsBoxes)
                            setMode('offline')
                            setPlayerCount({
                                count: 2,
                                tVt: false
                            })
                            sessionStorage.setItem('offlineData', JSON.stringify({
                                mode: 'offline',
                                playerCount: {
                                    count: 2,
                                    tVt: false
                                }
                            }))
                            navigate('/offline/game/4980')
                        }else{
                            fetchGrid().then(((data) => {
                                setBoxes(data.boxes)
                                setMode('offline')
                                setPlayerCount({
                                    count: 2,
                                    tVt: false
                                })
                                sessionStorage.setItem('offlineData', JSON.stringify({
                                    mode: 'offline',
                                    playerCount: {
                                        count: 2,
                                        tVt: false
                                    }
                                }))
                                navigate('/offline/game/4980')
                            })).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                } }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    <h2>2 player</h2>
                </div>
                <div className="option" onClick={ () => {
                    if(boxes.length > 0){
                        const lsBoxes = JSON.parse(localStorage.getItem('boxes'))
                        if(lsBoxes){
                            setBoxes(lsBoxes)
                            setMode('offline')
                            setPlayerCount({
                                count: 3,
                                tVt: false
                            })
                            sessionStorage.setItem('offlineData', JSON.stringify({
                                mode: 'offline',
                                playerCount: {
                                    count: 3,
                                    tVt: false
                                }
                            }))
                            navigate('/offline/game/4980')
                        }else{
                            fetchGrid().then(((data) => {
                                setBoxes(data.boxes)
                                setMode('offline')
                                setPlayerCount({
                                    count: 3,
                                    tVt: false
                                })
                                sessionStorage.setItem('offlineData', JSON.stringify({
                                    mode: 'offline',
                                    playerCount: {
                                        count: 3,
                                        tVt: false
                                    }
                                }))
                                navigate('/offline/game/4980')
                            })).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                } }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    <h2>3 player</h2>
                </div>
                <div className="option" onClick={ () => {
                     if(boxes.length > 0){
                        const lsBoxes = JSON.parse(localStorage.getItem('boxes'))
                        if(lsBoxes){
                            setBoxes(lsBoxes)
                            setMode('offline')
                            setPlayerCount({
                                count: 4,
                                tVt: false
                            })
                            sessionStorage.setItem('offlineData', JSON.stringify({
                                mode: 'offline',
                                playerCount: {
                                    count: 4,
                                    tVt: false
                                }
                            }))
                            navigate('/offline/game/4980')
                        }else{
                            fetchGrid().then(((data) => {
                                setBoxes(data.boxes)
                                setMode('offline')
                                setPlayerCount({
                                    count: 4,
                                    tVt: false
                                })
                                sessionStorage.setItem('offlineData', JSON.stringify({
                                    mode: 'offline',
                                    playerCount: {
                                        count: 4,
                                        tVt: false
                                    }
                                }))
                                navigate('/offline/game/4980')
                            })).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                } }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    <h2>4 player</h2>
                </div>
                <div className="option" onClick={ () => {
                    if(boxes.length > 0){
                        const lsBoxes = JSON.parse(localStorage.getItem('boxes'))
                        if(lsBoxes){
                            setBoxes(lsBoxes)
                            setMode('offline')
                            setPlayerCount({
                                count: 4,
                                tVt: true
                            })
                            sessionStorage.setItem('offlineData', JSON.stringify({
                                mode: 'offline',
                                playerCount: {
                                    count: 4,
                                    tVt: true
                                }
                            }))
                            navigate('/offline/game/6058')
                        }else{
                            fetchGrid().then(((data) => {
                                setBoxes(data.boxes)
                                setMode('offline')
                                setPlayerCount({
                                    count: 4,
                                    tVt: true
                                })
                                sessionStorage.setItem('offlineData', JSON.stringify({
                                    mode: 'offline',
                                    playerCount: {
                                        count: 4,
                                        tVt: true
                                    }
                                }))
                                navigate('/offline/game/6058')
                            })).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                } }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    <h2>2 v 2 players</h2>
                </div>
            </div>
        </div>
    )
}

export default Options2