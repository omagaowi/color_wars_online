import { useRef, useState } from 'react'
import Header from '../../components/Header.jsx'
import '../../styles/optionStyles/onlineForm.css'
import { root } from '../../utils/mainStore.js'
import Error from '../../components/Error.jsx'
import LoaderRing from '../../components/LoaderRing.jsx'
import Cookies from 'js-cookie';

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../utils/online/authStore.jsx'

const OnlineForm = () => {

    const { updateUserData } = useAuthStore((state) => ({
        updateUserData: state.updateUserData
    }))

    const [showRoom, setShowRoom] = useState(false)
    const [name, setName] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const setCookie = (key, value) => {
        Cookies.set(key, value);
      };



    const RoomForm = () => {
        const [isCreateRoom, setIsCreateRoom] = useState(false)
        const [roomID, setRoomId] = useState(false)
        const roomIdRef = useRef(false)

        const createRoom = (e) => {
            e.preventDefault()
            const url = `${root}/createroom`
            setLoading(prev => true)

            const headers = {
                'Content-Type': 'application/json'
            }

            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    room: e.target.roomID.value
                })
            }).then(response => response.json()).then(({data: createRoomData, error: createRoomError}) =>{
                // console.log(createRoomData, createRoomError)
                setLoading(prev => false)
                if(createRoomData){
                    const user = {
                        name: name,
                        userID: `${name}_${Number(Date.now().toString().split('').splice(6, 5).join(''))}`,
                        roomID: e.target.roomID.value
                    }
                    setCookie('userData', JSON.stringify(user))
                    updateUserData(user)
                    navigate(`/game/lobby/${e.target.roomID.value}`)
                }else{
                    setError(prev => 'Error creating room!')
                }
            }).catch(err => {
                setLoading(prev => false)
                setError(prev => 'An error occured, check your connection')
            })
        }

        const joinRoom = (e) => {
            e.preventDefault()
            setLoading(prev => true)
            const url = `${root}/joinroom`

            const headers = {
                'Content-Type': 'application/json'
            }

            if(e.target.roomID.value != ''){
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        room: e.target.roomID.value
                    })
                }).then(response => response.json()).then(({data: createRoomData, error: createRoomError}) =>{
                    setLoading(prev => false)
                    if(createRoomData){
                        const user = {
                            name: name,
                            userID: `${name}_${Number(Date.now().toString().split('').splice(6, 5).join(''))}`,
                            roomID: e.target.roomID.value
                        }
                        setCookie('userData', JSON.stringify(user))
                        updateUserData(user)
                        navigate(`/game/lobby/${e.target.roomID.value}`)
                    }else{
                        setError(prev => createRoomError)
                    }
                }).catch(err => {
                    setLoading(prev => false)
                    setError(prev => 'An error occured, check your connection')
                })
            }else{
                setLoading(prev => false)
                setError(prev => 'Enter a valid room id !!')
            }
            
        }

        return (
            <form className='room-form' onSubmit={ (e) => {
                if(isCreateRoom){
                    createRoom(e)
                }else{
                  joinRoom(e)
                }
            } }>
                <h2>Join Room</h2>
                <div className="input-field">
                    <input type="text" placeholder='Enter Room ID' ref={ roomIdRef } name='roomID'/>
                    <div className="create-btn" style={ { backgroundColor: isCreateRoom? '#31515f' : 'transparent' } } title='Create Rooom' onClick={() => {
                        setIsCreateRoom(prev => prev? false : true)
                        if(!isCreateRoom){
                                const newRoomID = Number(Date.now().toString().split('').splice(6, 5).join(''))
                                setRoomId(prev => newRoomID)
                                roomIdRef.current.value = newRoomID
                                roomIdRef.current.setAttribute('readonly', 'readonly')
                        }else{
                            roomIdRef.current.value = '';
                            roomIdRef.current.removeAttribute('readonly', 'readonly')
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </div>
                </div>
                <button>
                    <>
                        {
                            loading? (
                                <LoaderRing customClass={ 'formLoader' }/>
                            ):(
                                <>
                                  {
                                    isCreateRoom? (
                                            <>Create Room</>
                                        ) : (
                                            <>Join Room</>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                </button>
            </form>
        )
    }

    const NameForm = () => {

        const submitNameForm = (e) => {
            e.preventDefault()
            const player_name = e.target.player_name.value
            if(player_name != ''){
                setName(prev => player_name)
            }else{
                setError(prev => 'Enter name!!')
            }
        }

        return (
            <form className='name-form' onSubmit={(e) => {
                submitNameForm(e)
            }}>
                <h2>Enter Name</h2>
                <div className="input-field">
                    <input type="text" name='player_name' placeholder='Enter Name...'/>
                </div>
                <button type='submit'>Next</button>
            </form>
        )
    }

    return (
        <div className="options-container online-form">
            <Error error={ error } setError={ setError }/>
            {
                name? (
                    <RoomForm />
                ):(
                    <NameForm />
                )
            }
            <Header />
        </div>
    )
}

export default OnlineForm