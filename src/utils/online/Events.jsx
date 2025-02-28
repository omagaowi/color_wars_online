import { handlePlay } from "../../pages/Game/OnlineGame"
import { handleConnectErrors, handleStartEvent, handleUserEvents } from "../../pages/Options/Lobby"


const Events = (socket) => {
   socket.on('users', (data)=>{
    // console.log(data)
    handleUserEvents(data)
   })
   socket.on('joinError', (data) => {
    handleConnectErrors(data)
   })
   socket.on('startGame', (data) => {
      handleStartEvent(data)
   })
   socket.on('play', (data) => {
      handlePlay(data)
   })
}


export default Events