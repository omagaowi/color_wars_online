import { useEffect, useState} from "react"
import { generateGrid } from "../../utils/generateGrid.js"
import { useMenuStore, useEliminatedStore, useGridStore } from "../../utils/mainStore.js"
import Loader from "../../components/Loader.jsx"
import Grid from "../../components/GridArea.jsx"
import Results from "../../components/Results.jsx"
import GameError from "../../components/GameError.jsx"

let boxClick2v2
let turnInterval = false

const OfflineGame2v2 = () => {

    const { mode, setMode , playerCount, setPlayerCount} = useMenuStore((state) => ({ 
        playerCount: state.playerCount,
    })) 

    const { eliminated, setEliminated } = useEliminatedStore((state) => ({
        eliminated: state.eliminated,
        setEliminated: state.setEliminated
       }))

    const { boxes, setBoxes } = useGridStore((state) => ({
        boxes: state.boxes,
        setBoxes: state.setBoxes
    }))


    const [playOrder, setPlayOrder] = useState(false)
    const [showLoader, setShowLoader] = useState(true)
    const [playTurn, setPlayTurn] = useState('none')
    const [hasPlayed, setHasPlayed] = useState(false)
    const [grid, setGrid] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)
    const [initialPlays, setInitialPlays] = useState({
      blue: false,
      red: false,
      green: false,
      yellow: false,
    })

    console.log(playOrder)

    const determineRebound = (row, columnNo) => {
        const rebounds = [
            {
                row: row - 1,
                column: columnNo
            },
            {
                row: row,
                column: columnNo + 1
            },
            {
                row: row + 1,
                column: columnNo 
            },
            {
                row: row,
                column: columnNo - 1
            }
        ]
        return rebounds;
    }

    const checkInitialPlays = (player) => {
        if(player == 'blue'){
          return initialPlays.blue 
        }else if(player == 'red'){
          return initialPlays.red 
        }else if(player == 'green'){
          return initialPlays.green 
        }else{
          return initialPlays.yellow 
        }
    }

    const removeInitialPlays = (player) => {
        const dummyPlays = initialPlays 
        if(player == 'blue'){
          dummyPlays.blue = true
          setInitialPlays(prev => dummyPlays)
        }else if(player == 'red'){
          dummyPlays.red = true
          setInitialPlays(prev => dummyPlays)
        }else if(player == 'green'){
          dummyPlays.green = true
          setInitialPlays(prev => dummyPlays)
        }else{
          dummyPlays.yellow = true
          setInitialPlays(prev => dummyPlays)
        }
      }

    const chosen = (rowNo, columnNo, index, player, rootCell) => {
        // console.log(rowNo, columnNo)
        const thisBox = boxes.filter(function(el){
            return el.row == rowNo && el.column == columnNo
        })[0]

        const partner = playOrder.filter(function(el){
            return el.player == player
        })[0].partner

    
        if(thisBox.circles >= 4){
            const dummyBoxes = boxes
            const thisIndex = dummyBoxes.indexOf(thisBox)
            dummyBoxes[thisIndex].player = [player, partner]
            dummyBoxes[thisIndex].circles = 0
            dummyBoxes[thisIndex].player = []
            setBoxes(dummyBoxes)
            setTimeout(()=>{
                // setCirclesDOM(0, rowNo, columnNo)
                determineRebound(rowNo, columnNo).forEach((bound, index) => {
                    if(bound.row < 1 || bound.column < 1 || bound.row > grid.length || bound.column > grid.length){
                        // if the rebound is outside the grid just ignore
                    }else{
                        const chosenBox = boxes.filter(function(el){
                          return el.row == bound.row && el.column == bound.column
                        })[0]
                        const dummyBoxes = boxes
                        const thisIndex = dummyBoxes.indexOf(chosenBox)
                        dummyBoxes[thisIndex].player = [player, partner]
                        dummyBoxes[thisIndex].circles = chosenBox.circles + 1
                        sessionStorage.setItem('lastPlay', JSON.stringify({
                          timestamp: Date.now()
                        }))
                        setBoxes(dummyBoxes)
                        setTimeout(()=>{
                          chosen(bound.row, bound.column, index, player, `${columnNo}_${rowNo}`)
                        }, 700)
                    }  
                })
            }, 0)
        }else{
          sessionStorage.setItem('lastPlay', JSON.stringify({
            timestamp: Date.now()
          }))
        }
        
    }
    
    const checkPlayerScore = (player) => {
        if(boxes){
          const playerBoxes = boxes.filter(function(el){
            return el.player.includes(player)
          })
          return playerBoxes.length
        }
      }
  
      const eliminatePlayers = () => {
        if(playOrder){
          playOrder.forEach((item) => {
            if(checkPlayerScore(item.player) == 0 && checkInitialPlays(item.player)){
              if(!eliminated.includes(item.player)){
                setEliminated(item.player)
                setEliminated(item.partner)
              }
            }
          })
        }
      }
  
  
      const checkFirstPlace = (player) => {
        const playerBoxes = boxes.filter(function(el){
          return el.player.includes(player)
        })
        const occupiedBoxes =  boxes.filter(function(el){
          return el.player.length != 0
        })
        if(playerBoxes.length == occupiedBoxes.length){
          return true
        }else{
          return false
        }
      }

      boxClick2v2 = (thisBox) => {
        if(!hasPlayed){
            const player = playOrder[playTurn].player
            const partner = playOrder[playTurn].partner
            if(thisBox.player.length == 0){
              if(checkInitialPlays(player)){
               
              }else{
                const dummyBoxes = boxes
                const thisIndex = dummyBoxes.indexOf(thisBox)
                dummyBoxes[thisIndex].player = [player, partner]
                dummyBoxes[thisIndex].circles = 3
                setBoxes(dummyBoxes)
                removeInitialPlays(player)
                setHasPlayed(prev => true)
                setTimeout(() => {
                  chosen(thisBox.row, thisBox.column, 0, player, false)
                }, 700);
              }
            }else{
              if(thisBox.player.includes(playOrder[playTurn].player)){
                  const dummyBoxes = boxes
                  const thisIndex = dummyBoxes.indexOf(thisBox)
                  dummyBoxes[thisIndex].player = [player, partner]
                  dummyBoxes[thisIndex].circles += 1;
                  setBoxes(dummyBoxes)
                  setHasPlayed(prev => true)
                  setTimeout(() => {
                    chosen(thisBox.row, thisBox.column, 0, player, false)
                  }, 700);
              }
            }
          }
      }

      console.log(eliminated)

      const checkGroupEliminated = (player, partner) => {
        if(checkInitialPlays(player)){
          if(checkInitialPlays(partner)){
            return true
          }else{
            return true
          }
        }else{
          if(checkInitialPlays(partner)){
            return true
          }else{
            return false
          }
        }
      }

      const passEliminated2v2 = (eliminatedArray) => {
        const eliminatedReverse = eliminatedArray.reverse()
        let finalEliminated = []
        finalEliminated = [{
          player: eliminatedReverse[0],
          partner: eliminatedReverse[1]
        }, {
          player: eliminatedReverse[2],
          partner: eliminatedReverse[3]
        }]
        return finalEliminated
      }

      useEffect(() => {
        if(playOrder){
            sessionStorage.removeItem('lastPlay')
            setHasPlayed(prev => false)
            if(turnInterval){
              clearInterval(turnInterval)
            }
    
            eliminatePlayers()
            console.log(playOrder)
            if(checkInitialPlays(playOrder[playTurn].player) || checkInitialPlays(playOrder[playTurn].partner)){
              if(checkFirstPlace(playOrder[playTurn].player)){
                if(!eliminated.includes(playOrder[playTurn].player)){
                  setEliminated(playOrder[playTurn].player)
                  setEliminated(playOrder[playTurn].partner)
                  console.log('end game')
                  setGameEnded(true)
                }else{
                  console.log('end game')
                  setGameEnded(true)
                }
              }
            }

            // console.log(passEliminated2v2(eliminated))


            if(checkPlayerScore(playOrder[playTurn].player) == 0 && checkGroupEliminated(playOrder[playTurn].player, playOrder[playTurn].partner)){
              setPlayTurn(prev => prev >=  playerCount.count - 1? 0 : prev += 1)
            }else{
              turnInterval = setInterval(()=>{
                if(sessionStorage.getItem('lastPlay')){
                  const diff = Date.now() - JSON.parse(sessionStorage.getItem('lastPlay')).timestamp
                  if(diff > 1500){
                    setPlayTurn(prev => prev >=  playerCount.count - 1? 0 : prev += 1)
                    clearInterval(turnInterval)
                  }
                }
              }, 1000)
            }
        }
    }, [playTurn])

    useEffect(() => {
        if(playerCount){
            setPlayOrder(prev => generateGrid(playerCount.count, playerCount.tVt, boxes).order)
            setPlayTurn(0)
            setGrid(generateGrid(playerCount.count, false, boxes).rows)
            setBoxes(generateGrid(playerCount.count, false, boxes).boxes)
        }
    }, [])  

    return (
       <>
        {
          playTurn != 'none'? (
                <>
                  <div className={ `game-container ${ playOrder? playOrder[playTurn].player : false } ` } style={ { position: gameEnded? 'fixed': 'relative' } }>
                        {
                          playerCount? (
                              <>
                                  <Grid playTurn = { playTurn } playOrder = { playOrder } hasPlayed = { hasPlayed } initialPlays = { initialPlays }
                                  grid = { grid }/>
                                  { 
                                      showLoader ? (
                                          <Loader setLoader = { setShowLoader } firstPlay = { playOrder.length > 0? playOrder[0].player : false } playerCount = { playerCount.count }/>
                                      ) : (
                                          <></>
                                      )
                                  }
                              </>
                          ):(
                              <GameError />
                          )
                        }
                  </div>
                  {
                    gameEnded? (
                      <Results eliminated={ passEliminated2v2(eliminated) } twoVtwo = { true }/>
                    ):(
                      <></>
                    )
                  }
                </>
          ):(
            <GameError />
          )
        }
       </>
    )
}

export { boxClick2v2 }

export default OfflineGame2v2