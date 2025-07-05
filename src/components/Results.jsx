import { useEffect, useRef, useState } from 'react'
import '../styles/results.css'

const Results = ({ eliminated, twoVtwo, online }) => {
    const [results, setResults] = useState(false)
    const [fade, setFade] = useState(true)
    const resultsRef = useRef(false)
    
    console.log(results)


    const getPrefix = (position) => {
        switch(position){
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3: 
                return 'rd';
            case 4:
                return 'th';
        }
    }
    useEffect(()=>{
        let dummyResults = [...eliminated]
        // console.log(dummyResults)
        if(twoVtwo){
            dummyResults =  dummyResults.map((el) => ({
                player: twoVtwo? el.player : el,
                partner: twoVtwo? el.partner : false,
                show: false
             }))
        }else{
            if(online){
                dummyResults =  dummyResults.map((el) => ({
                    player: el.color.color,
                    playerID: el.playerID,
                    playerName: el.name,
                    partner: twoVtwo? el.partner : false,
                    show: false
                 }))
            }else{
                dummyResults =  dummyResults.map((el) => ({
                    player: twoVtwo? el.player : el,
                    partner: twoVtwo? el.partner : false,
                    show: false
                 })).reverse()
            }
        }
        console.log(dummyResults)
        setResults(prev => dummyResults)
        console.log(dummyResults)
        const fadeTimeout = setTimeout(() =>{
            setFade(prev => false)
            dummyResults.forEach((player, index) => {
                const thisPlayer = resultsRef.current.querySelectorAll('.results-player')[index]
                setTimeout(() => {
                   thisPlayer.classList.add('show')
                }, (index + 1) * 400)
            })
        }, 500)
       return () => clearTimeout(fadeTimeout)
    }, [])
    return (
        <>
            {
                results? (
                    <div className={`results ${ online? 'online' : '' } ${fade? 'fade': ''}`}>
                        <div className={`results-grid player${eliminated.length}mode`} ref={ resultsRef }> 
                            {
                                results.map((elem, index) => (
                                    <div className={`results-player player-${!twoVtwo? elem.player : `${elem.player}-${elem.partner}`} ${elem.show? 'show': ''}`}>
                                        <div className={`position ${ twoVtwo? 'twoVtwo': '' }`}>
                                            <h5>{index + 1}{ getPrefix(index + 1) }</h5>
                                        </div>
                                        {
                                            online? (
                                                <p className={`result-p-name`}>{ elem.playerName }</p>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className="results-actions">
                            {
                                !online? (
                                    <>
                                          <button>Restart Game</button>
                                          <button>End Game</button>
                                    </>
                                ):(
                                    <>
                                          <button>Leave Game</button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                ):(
                    <></>
                )
            }
        </>
    )
}

export default Results