import '../styles/gameStyles/box.css'
import { useMenuStore } from '../utils/mainStore.js'

import { boxClick } from '../pages/Game/OffilineGame.jsx'
import { boxClick2v2 } from '../pages/Game/OfflineGame2v2.jsx'

const Box = ({ gridRef, grid, columnIndex, rowIndex, boxes }) => {
    const { playerCount, mode } = useMenuStore((state) => ({ 
        playerCount: state.playerCount,
        mode: state.mode
    }))  


    const thisBox = boxes.filter(function(el){ return el.row == rowIndex && el.column == columnIndex })[0]

    return (
        <div className={ `box cir${thisBox.circles} r${rowIndex + 1} c${columnIndex + 1}  bx-${playerCount.tVt? `${thisBox.player[0]}-${thisBox.player[1]} ` : thisBox.player[0] }` } style={ { width: `${gridRef? (gridRef.current.offsetWidth - grid.length * 10 )/ grid.length: 0 }%` } } onClick={() => { 
            if(playerCount.tVt && mode == 'offline'){
                boxClick2v2(thisBox)
            }else{
                boxClick( thisBox ) 
            }
            } } >
             <div className={ `circle circle${thisBox.circles}` }>
                <div className="dots"></div>
                <div className="dots"></div>
                <div className="dots"></div>
                <div className="dots"></div>
            </div>
        </div>
    )
}

export default Box