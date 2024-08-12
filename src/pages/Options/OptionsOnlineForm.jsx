import { useRef, useState } from 'react'
import Header from '../../components/Header.jsx'
import '../../styles/optionStyles/onlineForm.css'


const OnlineForm = () => {

    const [showRoom, setShowRoom] = useState(false)

    const RoomForm = () => {

        const [isCreateRoom, setIsCreateRoom] = useState(false)
        const [roomID, setRoomId] = useState(false)
        const roomIdRef = useRef(false)

        const createRoom = () => {
            
        }

        const joinRoom = () => {

        }

        return (
            <form className='room-form'>
                <h2>Join Room</h2>
                <div className="input-field">
                    <input type="text" placeholder='Enter Room ID' ref={ roomIdRef }/>
                    <div className="create-btn" style={ { backgroundColor: isCreateRoom? '#31515f' : 'transparent' } } title='Create Rooom' onClick={() => {
                        setIsCreateRoom(prev => prev? false : true)
                        if(!isCreateRoom){
                            const newRoomID = Number(Date.now().toString().split('').splice(7, 5).join(''))
                            setRoomId(prev => newRoomID)
                            roomIdRef.current.value = newRoomID
                        }else{
                            roomIdRef.current.value = '';
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </div>
                </div>
                <button>{
                    isCreateRoom? (
                        <>Create Room</>
                    ) : (
                        <>Join Room</>
                    )
                    }</button>
            </form>
        )
    }

    const NameForm = () => {

        const submitNameForm = (e) => {
            e.preventDefault()
            const player_name = e.target.player_name.value
            console.log(player_name)
        }

        return (
            <form className='name-form' onSubmit={(e) => {
                submitNameForm(e)
            }}>
                <h2>Enter Name</h2>
                <div className="input-field">
                    <input type="text" name='player_name'/>
                </div>
                <button type='submit'>Next</button>
            </form>
        )
    }

    return (
        <div className="options-container online-form">
            <Header />
            <RoomForm />
        </div>
    )
}

export default OnlineForm