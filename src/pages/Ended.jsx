import '../styles/optionStyles/server.css'

const EndedGame = () => {
    return (
        <div className="server-wait-container">
            <h1>This Game has Ended!!</h1>
            <p>Thank you for playing. Try joining another game</p>
            <div className="buttons">
                <button>New Game</button>
            </div>
        </div>
    )
}



export default EndedGame