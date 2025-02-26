import './styles/App.css' 
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './styles/optionStyles/optionStyles.css'
import { useEffect, useState } from 'react'
import Options1 from './pages/Options/Options1.jsx'

import Options2 from './pages/Options/Options2.jsx'

import Lobby from './pages/Options/Lobby.jsx'

import OfflineGame from './pages/Game/OffilineGame.jsx'
import OfflineGame2v2 from './pages/Game/OfflineGame2v2.jsx'

import OnlineForm from './pages/Options/OptionsOnlineForm.jsx'
import io from 'socket.io-client';
import ServerWait from './pages/Options/Server.jsx'
import { rootURI, useAuthStore } from './utils/online/authStore.jsx'
import { alertStore, gameDataStore, colors } from './utils/online/otherStores.jsx'
import Alerts from './components/Alerts.jsx'
import { playLogic, timeOutLogic } from './pages/Game/OnlineGame.jsx'
import OnlineGame from './pages/Game/OnlineGame.jsx'
import Cookies from 'js-cookie'




function App() {

 
  const { userData, updateUserData, currentRoom, currentRoomPlayers, updateCurrentRoomPlayers, updateCurrentRoom, clientSocket, isAdmin, updateisAdmin, lobbyLoading, setLobbyLoading } = useAuthStore((state) => ({
    userData: state.userData,
    updateUserData: state.updateUserData,
    currentRoom: state.currentRoom,
    updateCurrentRoom: state.updateCurrentRoom,
    currentRoomPlayers: state.currentRoomPlayers,
    updateCurrentRoomPlayers: state.updateCurrentRoomPlayers,
    clientSocket: state.clientSocket,
    isAdmin: state.isAdmin,
    updateisAdmin: state.updateisAdmin,
    lobbyLoading: state.lobbyLoading,
    setLobbyLoading: state.setLobbyLoading
}))

const { gameData, updateGameData } = gameDataStore((state) => ({
  gameData: state.gameData,
  updateGameData: state.updateGameData,
}))



const { show, alert, setShow, setAlert, timeout, updateTimeout } = alertStore((state) => ({
  alert: state.alert,
  show: state.show,
  setShow: state.setShow,
  setAlert: state.setAlert,
  timeout: state.timeout,
  updateTimeout: state.updateTimeout
}))


 const { setPlayLoading } = gameDataStore((state) => ({
  setPlayLoading: state.setPlayLoading
}))


  useEffect(() => {
    const findAdmin = currentRoomPlayers.filter(function(el){
        return el.admin == true
    })[0]
    if(findAdmin){
        if(findAdmin.userID == userData.userID){
            updateisAdmin(true)
        }else{
            updateisAdmin(false)
        }
    }
  }, [currentRoomPlayers])

  useEffect(() => {
    // Establish socket connection
      // const newSocket = io(rootURI);
      // updateClientSocket(newSocket)

      // newSocket.on('disconnect', () => {
      //   console.log('you have been disconnected')
      // })

      clientSocket.on('play', (data) => {
          playLogic(data.box)
          setPlayLoading(false)
      })

      const userPresenceAlerts = (data) => {
        if(data.user.userID == JSON.parse(Cookies.get('userData')).userID){
          updateUserData({...data.user, status: 'online'})
          updateCurrentRoom(data.room)
          setShow(false)
          clearTimeout(timeout)
           updateTimeout( setTimeout(() => {
               setAlert({
                   type: data.action == 'joined'? 'success' : 'error',
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
                       type: data.action == 'joined'? 'success' : 'error',
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
      }


      clientSocket.on('users', (data)=>{
        const urlSplit = window.location.href.split('/')
        if(urlSplit[4] == 'lobby'){ 
          setLobbyLoading(false)
          const dummyPlayers = data.room.users.filter(function(player){
            return player.status == 'online'
          }).map((player, index) => ({
              ...player,
              playerColor: colors[index],
              me: userData.userID == player.userID? true : false,
              admin: index == 0? true : false
          }))
          updateCurrentRoomPlayers(dummyPlayers)
          userPresenceAlerts(data)
        }else if(urlSplit[3] == 'online' && urlSplit[4] == 'game'){
          console.log(data)
          updateCurrentRoom(data.room)
          updateCurrentRoomPlayers(data.room.users)
          // updateGameData({...gameData, users: data.room.users })
          userPresenceAlerts(data)
        }
      })

      clientSocket.on('timeout', (data) => {
          timeOutLogic(data)
      })

      clientSocket.on('disconnectTimeout', ()=>{
        
      })

      return () => {
        clientSocket.off('play')
        clientSocket.off('timeout')
    }
    
  
  }, []);


  // useEffect(() => {
  //   if (socket) {
  //     // Listen for events from the backend
  //     socket.on("messageFromServer", (data) => {
  //       console.log(data)
  //       setMessage(data);
  //     });
     
  //   }
  // }, [socket]);

  return (
    <BrowserRouter>
      <div className="main">
        <Alerts alert={ alert } alertShow = { show }/>
        <Routes>
            <Route path='/'  element = { <Navigate to={ '/options/8537' }  />}/>
             <Route path='/options/8537' element={ <Options1 /> }/>
             <Route path='/options/offline/4898' element={ <Options2 /> }/>

             <Route path='/offline/game/4980' element={ <OfflineGame /> }/>
             <Route path='/offline/game/6058' element={ <OfflineGame2v2 /> }/>
             <Route path='/online/game/:roomID' element={ <OnlineGame /> }/>

             <Route path='/options/online/8794' element={ <OnlineForm /> }/>
             <Route path='/game/lobby/:roomID' element={ <Lobby /> }/>
             <Route path='/joinroom' element={ <OnlineForm /> }/>
             <Route path='/server/pickup/2417' element = { <ServerWait /> } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
