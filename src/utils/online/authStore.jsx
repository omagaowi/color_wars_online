import { create } from 'zustand';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

const rootURI = 'http://localhost:4000'



const useAuthStore = create((set) => ({
    userData: localStorage.getItem('userData')? {...JSON.parse(localStorage.getItem('userData')), status: 'offline', room: {
        roomID: false,
        roomUID: false,
        joined: false
    }} : false,
    updateUserData: (data) => set((state) => ({
        userData: data
    })),
    currentRoom: false,
    updateCurrentRoom: (data) => set((state) => ({
        currentRoom: data
    })),
    currentRoomPlayers: [],
    updateCurrentRoomPlayers: (data) => set((state) => ({
        currentRoomPlayers: data
    })),
    clientSocket: io(rootURI),
    updateClientSocket: (data) => set((state) => ({
        clientSocket: data
    })),
    isAdmin: false,
    updateIsAdmin: (data) => set((state) => ({
        isAdmin: data
    })),
    lobbyLoading: true,
    setLobbyLoading: (data) => set((state) => ({
        lobbyLoading: data
    })),
}))

export { useAuthStore, rootURI }