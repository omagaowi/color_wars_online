import { useEffect } from "react"
import Grid from "../../components/GridArea.jsx"
import { useGridStore } from "../../utils/mainStore.js"
import { generateGrid } from "../../utils/generateGrid.js"
import { gameDataStore, alertStore } from "../../utils/online/otherStores.jsx"
import { useState } from "react"
import Loader from "../../components/Loader.jsx"
import { useMenuStore } from "../../utils/mainStore.js"
import { useAuthStore } from "../../utils/online/authStore.jsx"
import GameHeading from "../../components/GameHeading.jsx"


let boxClickOnline
let playLogic
let timeOutLogic
let disconnectTimer

const OnlineGame = () => {

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

    const [playOrder, setPlayOrder] = useState([])
    const [showLoader, setShowLoader] = useState(true)
    const [grid, setGrid] = useState(false)
    const [playTurn, setPlayTurn] = useState(0)
    const { gameData, updateGameData, setPlayLoading} = gameDataStore((state) => ({
        gameData: state.gameData,
        updateGameData: state.updateGameData,
        setPlayLoading: state.setPlayLoading
    }))
    const [hasPlayed, setHasPlayed] = useState(false)
    const [timer, setTimer] = useState(0)
    let time

    const { mode, setMode, playerCount, setPlayerCount} = useMenuStore((state) => ({ 
        mode: state.mode,
        setMode: state.setMode,
        playerCount: state.playerCount,
        setPlayerCount: state.setPlayerCount
    }))  

    const { boxes, setBoxes } = useGridStore((state) => ({
        boxes: state.boxes,
        setBoxes: state.setBoxes
    })) 

    const { show, alert, setShow, setAlert, timeout, updateTimeout } = alertStore((state) => ({
        alert: state.alert,
        show: state.show,
        setShow: state.setShow,
        setAlert: state.setAlert,
        timeout: state.timeout,
        updateTimeout: state.updateTimeout
    }))

    let turnInterval = false

    const [initialPlays, setInitialPlays] = useState({
        blue: false,
        red: false,
        green: false,
        yellow: false,
    })


    const determineRebound = (row, columnNo) => {
        const rebounds = [
            {
                row: row - 1,
                column: columnNo
            },
            {
                row: row,
                column: columnNo + 1
            },
            {
                row: row + 1,
                column: columnNo 
            },
            {
                row: row,
                column: columnNo - 1
            }
        ]
        return rebounds;
    }


    const checkInitialPlays = (player) => {
        if(player == 'blue'){
          return initialPlays.blue 
        }else if(player == 'red'){
          return initialPlays.red 
        }else if(player == 'green'){
          return initialPlays.green 
        }else{
          return initialPlays.yellow 
        }
    }

    const removeInitialPlays = (player) => {
        const dummyPlays = initialPlays 
        if(player == 'blue'){
          dummyPlays.blue = true
          setInitialPlays(prev => dummyPlays)
        }else if(player == 'red'){
          dummyPlays.red = true
          setInitialPlays(prev => dummyPlays)
        }else if(player == 'green'){
          dummyPlays.green = true
          setInitialPlays(prev => dummyPlays)
        }else{
          dummyPlays.yellow = true
          setInitialPlays(prev => dummyPlays)
        }
    }


    const chosen = (rowNo, columnNo, index, player, rootCell) => {
        // console.log(rowNo, columnNo)
        const thisBox = boxes.filter(function(el){
            return el.row == rowNo && el.column == columnNo
        })[0]
    
        if(thisBox.circles >= 4){
            const dummyBoxes = boxes
            const thisIndex = dummyBoxes.indexOf(thisBox)
            dummyBoxes[thisIndex].player = [player]
            dummyBoxes[thisIndex].circles = 0
            dummyBoxes[thisIndex].player = []
            setBoxes(dummyBoxes)
            setTimeout(()=>{
                // setCirclesDOM(0, rowNo, columnNo)
                determineRebound(rowNo, columnNo).forEach((bound, index) => {
                    if(bound.row < 1 || bound.column < 1 || bound.row > grid.length || bound.column > grid.length){
                        // if the rebound is outside the grid just ignore
                    }else{
                        const chosenBox = boxes.filter(function(el){
                          return el.row == bound.row && el.column == bound.column
                        })[0]
                        const dummyBoxes = boxes
                        const thisIndex = dummyBoxes.indexOf(chosenBox)
                        dummyBoxes[thisIndex].player = [player]
                        dummyBoxes[thisIndex].circles = chosenBox.circles + 1
                        sessionStorage.setItem('lastPlay', JSON.stringify({
                          timestamp: Date.now()
                        }))
                        setBoxes(dummyBoxes)
                        setTimeout(()=>{
                          chosen(bound.row, bound.column, index, player, `${columnNo}_${rowNo}`)
                        }, 700)
                    }  
                })
            }, 0)
        }else{
          sessionStorage.setItem('lastPlay', JSON.stringify({
            timestamp: Date.now()
          }))
        }
        
    }

    const emitPlay = async (thisBox) => {
        try {
            const data = {
                player: userData,
                room: currentRoom,
                box: thisBox,
                turn: playOrder[playTurn]
            }
            clientSocket.emit('play', data)
            return true
        } catch (error) {
            throw error
        }
    }

    const emitTimeout = async () => {
        try {
            const data = {
                player: userData,
                room: currentRoom,
                box: false,
                turn: playOrder[playTurn]
            }
            clientSocket.emit('timeout', data)
        } catch (error) {
            throw error
        }
    }

    const getPlayerTurn = () => {
        console.log(currentRoom)
        const player = currentRoom.users.find(function(el){
            return el.playerColor.color == gameData.gameInfo.playOrder[playTurn] 
        })
        console.log(gameData)
        return player
    }
    

    boxClickOnline = (thisBox) => {
        if(getPlayerTurn().userID == userData.userID){
            const player = playOrder[playTurn]
            if(thisBox.player.length == 0){
                if(checkInitialPlays(player)){
                    	
                }else{
                    setHasPlayed(prev => true)
                    setPlayLoading(true)
                    emitPlay(thisBox).then(() => {
                        
                    }).catch((err) => {
                        setHasPlayed(prev => false)
                        setPlayLoading(false)
                    })
                }
            }else{
                if(thisBox.player.includes(playOrder[playTurn])){
                   //play
                   setHasPlayed(prev => true)
                   setPlayLoading(true)
                   emitPlay(thisBox).then(() => {
                        setPlayLoading(false)
                   }).catch((err) => {
                         setHasPlayed(prev => false)
                        setPlayLoading(false)
                   })
                }
            }
        }
    }


    playLogic = (box) => {
        console.log(box)
        const thisBox = boxes.find(function(el){
            return el.row == box.row && el.column == box.column
        })
            const player = playOrder[playTurn]
            if(thisBox.player.length == 0){
              if(checkInitialPlays(player)){
               
              }else{
                const dummyBoxes = boxes
                const thisIndex = dummyBoxes.indexOf(thisBox)
                dummyBoxes[thisIndex].player = [player]
                dummyBoxes[thisIndex].circles = 3
                setBoxes(dummyBoxes)
                removeInitialPlays(player)
                setTimeout(() => {
                  chosen(thisBox.row, thisBox.column, 0, player, false)
                }, 700);
              }
            }else{
              if(thisBox.player.includes(playOrder[playTurn])){
                  const dummyBoxes = boxes
                  const thisIndex = dummyBoxes.indexOf(thisBox)
                  dummyBoxes[thisIndex].player = [player]
                  dummyBoxes[thisIndex].circles += 1;
                //   console.log(dummyBoxes[thisIndex].circles += 1)
                  setBoxes(dummyBoxes)
                  setTimeout(() => {
                    chosen(thisBox.row, thisBox.column, 0, player, false)
                  }, 700);
              }
            }
    }

    timeOutLogic = (data) => {
        updateTimeout(setTimeout(() => {
            setAlert({
                type: 'warning',
                users: [ getPlayerTurn() ],
                message: getPlayerTurn().userID == userData.userID? 'time up!' : `${getPlayerTurn().name}'s time was up!`,
                color: getPlayerTurn().playerColor.color
            })
            setTimeout(() => {
                setShow(true)
            }, 200)
        }, 100))
        setTimeout(() => {
            setPlayTurn(prev => prev >=  playerCount.count - 1? 0 : prev += 1)
        }, 1700);
    }



    // boxClickOnline = (thisBox) => {
    //     if(!hasPlayed){
            
    //     }
    // }


    useEffect(() => {
        if(timer < 15){
            time = setTimeout(() => setTimer(prev => prev += 0.2), 200)
            if(hasPlayed){
              clearTimeout(time)
            }
            return () => clearTimeout(time)
        }else{
            if(getPlayerTurn().userID == userData.userID){
                emitTimeout().then(() => {

                }).catch(() => {

                })
                console.log('timeout')
            }
        }
      },[timer])




      const emitDisconnectTimeout = async (data) => {
        try {
            await clientSocket.emit('disconnectTimeout', data)
        } catch (error) {
            throw error;
        }
      }

    
    useEffect(() => {
        sessionStorage.removeItem('lastPlay')
        console.log(getPlayerTurn())
        if(getPlayerTurn().status === 'disconnected'){
            disconnectTimer = setTimeout(() => {
                const data = {
                    player: getPlayerTurn(),
                    room: currentRoom,
                    box: false,
                    turn: playOrder[playTurn]
                }
               emitDisconnectTimeout(data).then(() => {
                console.log('timeout')
               }).catch((err) => {

               })
               clearTimeout(disconnectTimer)
            }, 15000)
        }else if(getPlayerTurn().status === 'left'){

        }else if(getPlayerTurn().status === 'online'){
            if(showLoader == false){
                updateTimeout(setTimeout(() => {
                    setAlert({
                        type: 'turn',
                        users: [ getPlayerTurn() ],
                        message: getPlayerTurn().userID == userData.userID? 'your turn!' : `${getPlayerTurn().name}'s turn!`,
                        color: getPlayerTurn().playerColor.color
                    })
                    setTimeout(() => {
                        setShow(true)
                    }, 200)
                }, 100))
            }
    
            if(showLoader == false){
                if(getPlayerTurn().userID == userData.userID){
                    setTimer(prev => 0)
                }
            }
    
            setHasPlayed(prev => false)
              turnInterval = setInterval(()=>{
                if(sessionStorage.getItem('lastPlay')){
                  const diff = Date.now() - JSON.parse(sessionStorage.getItem('lastPlay')).timestamp
                  if(diff > 1500){
                    setPlayTurn(prev => prev >=  playerCount.count - 1? 0 : prev += 1)
                    clearInterval(turnInterval)
                  }
                }
              }, 1000)
        }
    }, [playTurn])

    useEffect(() => {
        if(showLoader == false){
          setTimer(prev => 0)
        }
      }, [showLoader])

    useEffect(() => {
        if(!showLoader){
            updateTimeout(setTimeout(() => {
                setAlert({
                    type: 'turn',
                    users: [ getPlayerTurn() ],
                    message: getPlayerTurn().userID == userData.userID? 'your turn!' : `${getPlayerTurn().name}'s turn!`,
                    color: getPlayerTurn().playerColor.color
                })
                setTimeout(() => {
                    setShow(true)
                }, 200)
            }, 100))
        }
    }, [showLoader])

    useEffect(() => {
        if(gameData){
            setPlayOrder(gameData.gameInfo.playOrder)
            setGrid(gameData.gameInfo.playGrid)
            setMode('online')
            setPlayerCount({
                tvt: false,
                count: gameData.gameInfo.playOrder.length
            })
        }
    }, [])

    return (
        <>
            {
                playerCount?(
                    <div className={`game-container ${playOrder[playTurn]}`}>
                        {
                            boxes.length > 0? (
                                <Grid grid = { grid }/>
                            ):(
                                <></>
                            )
                        }
                        <>
                        { 
                            showLoader ? (
                                <Loader setLoader = { setShowLoader } firstPlay = { playOrder.length > 0 ? playOrder[0] : false } playerCount = { playerCount }/>
                            ) : (
                                <>
                                  <GameHeading color = { playOrder[playTurn] } players = { [] } timer = { timer } isTurn = { getPlayerTurn().userID == userData.userID } />
                                </>
                            )
                        }
                        </>
                    </div>
                ):(
                    <></>
                )
            }
        </>
    )
}

export { boxClickOnline, playLogic, timeOutLogic}
export default OnlineGame