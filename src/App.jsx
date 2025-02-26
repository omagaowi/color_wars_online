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
// import { playLogic, timeOutLogic } from './pages/Game/OnlineGame.jsx'
import OnlineGame from './pages/Game/OnlineGame.jsx'
import Cookies from 'js-cookie'
import Events from './utils/online/Events.jsx'




function App() {
  const {setShow, setAlert, show,  timeout, updateTimeout } = alertStore((state) => ({
    setShow: state.setShow,
    show: state.show,
    setAlert: state.setAlert,
    timeout: state.timeout,
    updateTimeout: state.updateTimeout
}))

const { clientSocket } = useAuthStore((state) => ({
  clientSocket: state.clientSocket
}))

 
  useEffect(() => {

    // Establish socket connection
      // const newSocket = io(rootURI);
      // updateClientSocket(newSocket)

      // newSocket.on('disconnect', () => {
      //   console.log('you have been disconnected')
      // })

      if(clientSocket){
        Events(clientSocket)
      }

    

      return () => {
        clientSocket.off('users')
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
