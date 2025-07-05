import { useEffect } from 'react'
import CircularLoader from '../components/CircularLoader'
import Results from '../components/Results'
import '../styles/gameStyles/onlineResults.css'
import { rootURI, useAuthStore } from '../utils/online/authStore'
import useFetch from '../utils/online/useFetch'

const OnlineResults = () => {
    const { gameResults, setGameResults } =  useAuthStore((state) => ({
        gameResults: state.gameResults,
        setGameResults: state.setGameResults
    }))

    const fetchResults = () => {
        const gameID = window.location.href.split('/')[5]
        const url = `${ rootURI }/game/result/${ gameID }`
        const headers = {

        }
        useFetch(url, false, headers, 'get').then(({ data, error }) => {
            console.log(data, error)
            setGameResults(data.results)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() =>{
        if(gameResults.length <= 0){
            fetchResults()
        }
    }, [])

    return (
        <div className="online-results">
            {
                gameResults.length > 0? (
                    <Results eliminated={ gameResults } online = { true }/>
                ):(
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <CircularLoader size={ 80 }  color='#fff'/>
                          <p style={ { color: 'white', marginTop: '20px' } }>Fetching game results...</p>
                    </div>
                )
            }
        </div>
    )
}

export default OnlineResults