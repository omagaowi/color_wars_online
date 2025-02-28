import { useEffect } from 'react'
import Header from '../../components/Header.jsx'
import LoaderRing from '../../components/LoaderRing.jsx'
import '../../styles/optionStyles/lobby.css'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useAuthStore } from '../../utils/online/authStore.jsx'
import { alertStore, colors, gameDataStore } from '../../utils/online/otherStores.jsx'
import { Await, useNavigate } from 'react-router-dom'
import { generateGrid } from '../../utils/generateGrid.js'
import Error from '../../components/Error.jsx'
import { useGridStore } from '../../utils/mainStore.js'
import CircularLoader from '../../components/CircularLoader.jsx'
import { newAlert } from '../../components/Alerts.jsx'


let handleUserEvents
let handleConnectErrors
let handleStartEvent 

const Lobby = () => {
    const navigate = useNavigate()
  
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [startGameLoading, setStartGameLoading] = useState(false)

    const { userData, updateUserData, isAdmin, updateIsAdmin, clientSocket, currentRoom, updateCurrentRoom, currentRoomPlayers, updateCurrentRoomPlayers } = useAuthStore((state) => ({
        userData: state.userData,
        updateUserData: state.updateUserData,
        currentRoom: state.currentRoom,
        currentRoomPlayers: state.currentRoomPlayers,
        updateCurrentRoom: state.updateCurrentRoom,
        updateCurrentRoomPlayers: state.updateCurrentRoomPlayers,
        clientSocket: state.clientSocket,
        isAdmin: state.isAdmin,
        updateIsAdmin: state.updateIsAdmin
    }))

    const { gameData, updateGameData } = gameDataStore((state) => ({
        gameData: state.gameData,
        updateGameData: state.updateGameData
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
            throw error
        }
    }

    console.log(currentRoom, currentRoomPlayers)


    handleUserEvents = (data) => {
        console.log(data)
        updateCurrentRoom(data.room)
        updateCurrentRoomPlayers(data.players)
        if(data.player.playerID == userData.playerID){
            setLoading(prev => false)
            updateUserData(data.player)
            newAlert({
                type: data.action == 'joined'? 'success' : 'error',
                users: [ data.user ],
                message: `you ${ data.action }`,
                color: data.action == 'joined'? 'green' : 'red'
            })
        }else{
            newAlert({
                type: data.action == 'joined'? 'success' : 'error',
                users: [ data.player ],
                message: `${ data.player.name } ${ data.action }`,
                color: data.action == 'joined'? 'green' : 'red'
            })
        }
        updateIsAdmin(data.players[0].playerID == userData.playerID? true : false)
    }

    // console.log(isAdmin)

    handleConnectErrors = (error) => {
        setLoading(false)
        setError(error)
    }

    handleStartEvent = (data) => {
        console.log(data)
        setStartGameLoading(prev => false)
        setBoxes(data.gameInfo.playBoxes)
        updateGameData({
            playOrder: data.gameInfo.playOrder,
            playGrid: data.gameInfo.playGrid
        })
        updateCurrentRoom(data.room)
        updateCurrentRoomPlayers(data.players)
        newAlert({
            type: 'success',
            message: 'This game has started',
            color: 'green',
            players: []
        })
        navigate(`/online/game/${ currentRoom.roomID }`)
    }

    const startGame = async (boxes) => {
        try {
            const data = {
                room: currentRoom,
                player: userData,
                players: currentRoomPlayers.map((player, index) => ({
                    ...player,
                    color: colors[index]
                })),
                gameInfo: {
                    playOrder: generateGrid(currentRoomPlayers.length, false, boxes).order,
                    playGrid: generateGrid(currentRoomPlayers.length, false, boxes).rows,
                    playBoxes: generateGrid(currentRoomPlayers.length, false, boxes).boxes
                }
            }
            // console.log(data)
            await clientSocket.emit('startGame', data)
            const result = true
            return result
        } catch (error) {
            throw error
        }
    }
    

    const joinRoom = async (data) => {
        try {
            if(clientSocket){
                await clientSocket.emit('joinroom', data)
                const result = true
                return result
            }
        } catch (error) {
            throw error
        }
    }


    useEffect(() => {
        setLoading(prev => true)
        if(userData && userData.playerID){
            const data = {
                name: userData.name,
                playerID: userData.playerID,
                room: window.location.href.split('/')[5]
            }
            setLoading(true)
            setError(false)
            joinRoom(data).then(result => {
                console.log(result)
            }).catch(error => {
                setLoading(false)
                setError('Please check your connection')
            })
        }else{
            navigate('/options/online/8794')
        }
    }, [])


    return (
        <div className="options-container lobby">
            <Header />
            {
                loading? (
                    <>
                        <CircularLoader size={ 100 } color='#73bbd9'/>
                    </>
                ):(
                    <>
                        {
                            error? (
                              <div className='lobby-error'>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                                </svg>
                                <h2>Error joining room</h2>
                                <p>{ error }</p>
                                <button onClick={ () => {
                                      if(userData && userData.playerID){
                                        const data = {
                                            name: userData.name,
                                            playerID: userData.playerID,
                                            room: window.location.href.split('/')[5]
                                        }
                                        setLoading(true)
                                        setError(false)
                                        joinRoom(data).then(result => {
                                            // console.log(result)
                                        }).catch(error => {
                                            setLoading(false)
                                            setError('Please check your connection')
                                        })
                                    }else{
                                        navigate('/options/online/8794')
                                    }
                                } }>Retry</button>
                              </div>
                            ):(
                                <>
                                     <div className={`lobby-grid player${currentRoomPlayers.length}mode`}>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">
                                                    {
                                                        currentRoomPlayers[0]? (
                                                            <>
                                                                {
                                                                `${ currentRoomPlayers[0].name } ${ currentRoomPlayers[0].playerID == userData.playerID ? '(me)' : '' }`
                                                                }
                                                            </>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player waiting">
                                            <CircularLoader size={ 80 } color='#406e81'/>
                                            <h3>Waiting for more players to join in</h3>
                                            <p>a game requires 2 players or more</p>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">
                                                {
                                                        currentRoomPlayers[1]? (
                                                            <>
                                                                {
                                                                `${ currentRoomPlayers[1].name } ${ currentRoomPlayers[1].playerID == userData.playerID ? '(me)' : '' }`
                                                                }
                                                            </>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">
                                                {
                                                        currentRoomPlayers[2]? (
                                                            <>
                                                                {
                                                                `${ currentRoomPlayers[2].name } ${ currentRoomPlayers[2].playerID == userData.playerID ? '(me)' : '' }`
                                                                }
                                                            </>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">
                                                {
                                                        currentRoomPlayers[3]? (
                                                            <>
                                                                {
                                                                `${ currentRoomPlayers[3].name } ${ currentRoomPlayers[3].playerID == userData.playerID ? '(me)' : '' }`
                                                                }
                                                            </>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lobby-actions">
                                                    {
                                                        isAdmin? (
                                                            <>
                                                                <button style={ { pointerEvents: startGameLoading? 'none' : 'all' } } onClick={ () => {
                                                                    if(currentRoomPlayers.length > 1){
                                                                        if(isAdmin){
                                                                            const lsBoxes = localStorage.getItem('boxes')
                                                                            if(lsBoxes){
                                                                                // console.log(JSON.parse(lsBoxes))
                                                                                setStartGameLoading(true)
                                                                                startGame(JSON.parse(lsBoxes)).then(result => {
                                                                                    
                                                                                }).catch(error => {
                                                                                    setStartGameLoading(false)
                                                                                })
                                                                            }else{
                                                                                fetchGrid().then(data => {
                                                                                    // console.log(data)
                                                                                    setStartGameLoading(true)
                                                                                    localStorage.setItem('boxes', JSON.stringify(data.boxes))
                                                                                    startGame(data.boxes).then(result => {

                                                                                    }).catch(error => {
                                                                                        etStartGameLoading(false)
                                                                                    })
                                                                                }).catch(error => {

                                                                                })
                                                                            }
                                                                        }
                                                                    }else{

                                                                    }
                                                                } }>
                                                                    <>{
                                                                        startGameLoading? (
                                                                            <>
                                                                                <CircularLoader size={ 25 } color='#73bbd9'/>
                                                                            </>
                                                                        ):(
                                                                            <>Start Game</>
                                                                        )
                                                                    }</>
                                                                </button>
                                                    <button>2 v 2 Game</button>
                                                    <button>End Game</button>
                                                            </>
                                                        ):(
                                                            <>
                                                            
                                                            </>
                                                        )
                                                    }
                                        <button>Leave Game</button>
                                    </div>
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}
export { handleUserEvents, handleConnectErrors, handleStartEvent }
export default Lobby