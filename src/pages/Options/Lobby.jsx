import Header from '../../components/Header.jsx'
import LoaderRing from '../../components/LoaderRing.jsx'
import '../../styles/optionStyles/lobby.css'


const Lobby = () => {
    return (
        <div className="options-container lobby">
            <Header />
            <div className="lobby-grid player3mode">
                <div className="lobby-player">
                    <div className="player-name-plate">
                        <div className="player-color"></div>
                        <h3 className="player-name">omaga(you)</h3>
                    </div>
                </div>
                <div className="lobby-player waiting">
                     <LoaderRing customClass = { 'lobby-loader' }/>
                     <h3>Waiting for more players to join in</h3>
                     <p>a game requires 2 players or more</p>
                </div>
                <div className="lobby-player">
                    <div className="player-name-plate">
                        <div className="player-color"></div>
                        <h3 className="player-name">dara</h3>
                    </div>
                </div>
                <div className="lobby-player">
                    <div className="player-name-plate">
                        <div className="player-color"></div>
                        <h3 className="player-name">victor</h3>
                    </div>
                </div>
                <div className="lobby-player">
                    <div className="player-name-plate">
                        <div className="player-color"></div>
                        <h3 className="player-name">emma</h3>
                    </div>
                </div>
            </div>
            <div className="lobby-actions">
                <button>Start Game</button>
                <button>2 v 2 Game</button>
                <button>Leave Game</button>
                <button>End Game</button>
            </div>
        </div>
    )
}

export default Lobby