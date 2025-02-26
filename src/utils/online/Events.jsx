import { handleConnectErrors, handleUserEvents } from "../../pages/Options/Lobby"


const Events = (socket) => {
   socket.on('users', (data)=>{
    // console.log(data)
    handleUserEvents(data)
   })
   socket.on('joinError', (data) => {
    handleConnectErrors(data)
   })
}


export default Events