import { useEffect } from 'react'
import Header from '../../components/Header.jsx'
import LoaderRing from '../../components/LoaderRing.jsx'
import '../../styles/optionStyles/lobby.css'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useAuthStore } from '../../utils/online/authStore.jsx'
import { alertStore, colors, gameDataStore } from '../../utils/online/otherStores.jsx'
import { useNavigate } from 'react-router-dom'
import { generateGrid } from '../../utils/generateGrid.js'
import Error from '../../components/Error.jsx'
import { useGridStore } from '../../utils/mainStore.js'


const Lobby = () => {
    const navigate = useNavigate()
  
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const { userData, updateUserData, currentRoom, currentRoomPlayers, updateCurrentRoomPlayers, updateCurrentRoom, clientSocket, isAdmin, updateisAdmin } = useAuthStore((state) => ({
        userData: state.userData,
        updateUserData: state.updateUserData,
        currentRoom: state.currentRoom,
        updateCurrentRoom: state.updateCurrentRoom,
        currentRoomPlayers: state.currentRoomPlayers,
        updateCurrentRoomPlayers: state.updateCurrentRoomPlayers,
        clientSocket: state.clientSocket,
        isAdmin: state.isAdmin,
        updateisAdmin: state.updateisAdmin
    }))

    const { show, alert, setShow, setAlert, timeout, updateTimeout } = alertStore((state) => ({
        alert: state.alert,
        show: state.show,
        setShow: state.setShow,
        setAlert: state.setAlert,
        timeout: state.timeout,
        updateTimeout: state.updateTimeout
    }))

    const { boxes, setBoxes } = useGridStore((state) => ({
        boxes: state.boxes,
        setBoxes: state.setBoxes
    })) 


    const { gameData, updateGameData } = gameDataStore((state) => ({
        gameData: state.gameData,
        updateGameData: state.updateGameData,
    }))

    const [joinError, setJoinError] = useState(false)
    const [startLoading, setStartLoading] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)

    const joinRoom = async () => {
        try{
            await clientSocket.emit('joinroom', userData)
            return true
        }catch(err){
            throw err
        }
    }

    const socketListening = () => {
        clientSocket.on('users', (data) => {
            const dummyPlayers = data.room.users.filter(function(player){
                return player.status == 'online'
            }).map((player, index) => ({
                ...player,
                playerColor: colors[index],
                me: userData.userID == player.userID? true : false,
                admin: index == 0? true : false
            }))
            updateCurrentRoomPlayers(dummyPlayers)
            if(data.user.userID === userData.userID){
               setLoading(prev => false)
               updateUserData({...data.user, status: 'online'})
               updateCurrentRoom(data.room)
               setShow(false)
               clearTimeout(timeout)
                updateTimeout( setTimeout(() => {
                    setAlert({
                        type: data.action,
                        users: [ data.user ],
                        message: `you ${data.action}!`,
                          color: data.action == 'joined'? 'green' : 'red'
                    })
                    setTimeout(() => {
                        setShow(true)
                    }, 200)
                }, 100))
            }else{
                setShow(false)
                clearTimeout(timeout)
                updateTimeout(
                    setTimeout(() => {
                        setAlert({
                            type: data.action,
                            users: [ data.user ],
                            message: `${data.user.name } ${data.action}!`,
                            color: data.action == 'joined'? 'green' : 'red'
                        })
                        setTimeout(() => {
                            setShow(true)
                        }, 200)
                    }, 100)
                )
            }
        })
        clientSocket.on('joinerror', (data)=> {
            setJoinError(prev => data)
            setLoading(prev => false)
            // console.log(data)
        })
    }


    const startGame = async () => {
        setStartLoading(prev => true)
        setGameStarted(prev => true)
        try {
            if(currentRoomPlayers.length >= 2){
                await clientSocket.emit('startgame', {
                    room: currentRoom,
                    player: userData,
                    gameInfo: {
                        playOrder: generateGrid(currentRoomPlayers.length).order,
                        playGrid: generateGrid(currentRoomPlayers.length).rows,
                        playBoxes: generateGrid(currentRoomPlayers.length).boxes
                    }
                })
                return true
            }
        } catch (error) {
           throw error
        }
    }

    clientSocket.on('startgame', (data)=>{
        setStartLoading(prev => false)
        setGameStarted(prev => true)
        clearTimeout(timeout)
        // console.log(data)
        updateGameData(data)
        setBoxes(data.gameInfo.playBoxes)
        navigate(`/online/game/${data.room.roomID}`)
        updateTimeout(setTimeout(() => {
            setAlert({
                type: 'gamestart',
                users: [ data.player ],
                message: `the game has started`,
                color: 'green'
            })
            setTimeout(() => {
                setShow(true)
            }, 200)
        }, 100))
    })
   

    useEffect(() => {
        const findAdmin = currentRoomPlayers.filter(function(el){
            return el.admin == true
        })[0]
        console.log(findAdmin)
        if(findAdmin){
            if(findAdmin.userID == userData.userID){
                updateisAdmin(true)
            }else{
                updateisAdmin(false)
            }
        }
    }, [currentRoomPlayers])

    useEffect(() => {
        setLoading(prev => true)
        if(clientSocket){
            const urlID = window.location.href.split('/')[5]
            if(urlID == userData.roomID){
                joinRoom().then(() => {
                    socketListening()
                }).catch((err) => {
                    
                })
            }else{
                
            }
        }else{
            
        }
    }, [])

    return (
        <div className="options-container lobby">
             <Error error={ error } setError={ setError }/>
            <Header />
            {
                loading? (
                    <LoaderRing customClass={ 'lobby-loader' }/>
                ):(
                    <>
                        {
                            joinError? (
                               <div className="error-dialog">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                                    </svg>
                                    <h2>Unable to join room !</h2>
                                    <p>Room doesn't exist</p>
                                    <button onClick={() => {
                                        navigate('/joinroom')
                                    }}>Retry</button>
                               </div>
                            ):(
                                <>
                                    <div className={`lobby-grid player${currentRoomPlayers.length}mode`}>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">{ currentRoomPlayers[0]? `${currentRoomPlayers[0].name} ${ currentRoomPlayers[0].me? '(me)' : '' }` : '' }</h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player waiting">
                                            <LoaderRing customClass = { 'lobby-loader' }/>
                                            <h3>Waiting for more players to join in</h3>
                                            <p>a game requires 2 players or more</p>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">{ currentRoomPlayers[1]? `${currentRoomPlayers[1].name} ${ currentRoomPlayers[1].me? '(me)' : '' }` : '' }</h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">{ currentRoomPlayers[2]? `${currentRoomPlayers[2].name} ${ currentRoomPlayers[2].me? '(me)' : '' }` : '' }</h3>
                                            </div>
                                        </div>
                                        <div className="lobby-player">
                                            <div className="player-name-plate">
                                                <div className="player-color"></div>
                                                <h3 className="player-name">{ currentRoomPlayers[3]? `${currentRoomPlayers[3].name} ${ currentRoomPlayers[3].me? '(me)' : '' }` : '' }</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lobby-actions">
                                        {
                                            isAdmin? (
                                                <>
                                                    <button onClick={ () => {
                                                        startGame().then(() => {
                                                            clientSocket.on('startgameError', ()=>{
                                                                setGameStarted(prev => false)
                                                                setStartLoading(prev => false)
                                                                setError('An Error Occured!')
                                                            })
                                                        }).catch(err => {
                                                            setGameStarted(prev => false)
                                                            setStartLoading(prev => false)
                                                            setError('An Error Occured!')
                                                        })
                                                    } } style={ { pointerEvents: gameStarted? 'none' : 'all' } }>{
                                                        startLoading? (
                                                            <LoaderRing customClass = { 'start-btn-loader' }/>
                                                        ):(
                                                            <>Start Game</>
                                                        )
                                                    }</button>
                                                    <button>2 v 2 Game</button>
                                                    <button>End Game</button>
                                                </>
                                            ):(
                                                <></>
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

export default Lobby