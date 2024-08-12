import './styles/App.css' 
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './styles/optionStyles/optionStyles.css'

import Options1 from './pages/Options/Options1.jsx'

import Options2 from './pages/Options/Options2.jsx'

import Lobby from './pages/Options/Lobby.jsx'

import OfflineGame from './pages/Game/OffilineGame.jsx'
import OfflineGame2v2 from './pages/Game/OfflineGame2v2.jsx'

import OnlineForm from './pages/Options/OptionsOnlineForm.jsx'

import ably from './utils/online/Ably.jsx'


function App() {

  // const get = async (channel) => {
  //   const presenceSet = await channel.presence.get();
  //   console.log(presenceSet)
  // }

  return (
    <BrowserRouter>
      <div className="main">
        <Routes>
            <Route path='/'  element = { <Navigate to={ '/options/8537' }  />}/>
             <Route path='/options/8537' element={ <Options1 /> }/>
             <Route path='/options/offline/4898' element={ <Options2 /> }/>

             <Route path='/offline/game/4980' element={ <OfflineGame /> }/>
             <Route path='/offline/game/6058' element={ <OfflineGame2v2 /> }/>

             <Route path='/options/online/8794' element={ <OnlineForm /> }/>
             <Route path='/game/lobby/8794' element={ <Lobby /> }/>
             <Route path='/joinroom' element={ <OnlineForm /> }/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
