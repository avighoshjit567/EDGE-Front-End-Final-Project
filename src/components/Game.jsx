import { useState, useEffect } from "react";
import Square from "./Square";
function Game() {
    const [xIsNext, setXIsNext] = useState(true);
    const [square, setSquare] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [isMachine, setIsMachine] = useState(false);
    
    const [score, setScore] = useState(() => {
        const savedScore = localStorage.getItem("score");
        return savedScore ? JSON.parse(savedScore) : { X: 0, O: 0 };
    });

    // Load score from localStorage on component mount
    useEffect(() => {
        const storedScore = JSON.parse(localStorage.getItem("score"));
        if (storedScore) {
            setScore(storedScore);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("score", JSON.stringify(score));
    }, [score]);

    function handleClick(i) {
        if (square[i] || calculateWinner(square)) {
            return;
        }
        // const nextSquare = square.slice();
        const nextSquare = [...square];
        nextSquare[i] = xIsNext ? "X" : "O";
        setSquare(nextSquare);
        setXIsNext(!xIsNext);
        const abc = calculateWinner(nextSquare);
        if (abc) {
            return;
        }
        console.log(isMachine);
        console.log(xIsNext);

        if (isMachine && xIsNext) {
            // aiMove(nextSquare)
            setTimeout(() => aiMove(nextSquare), 500);
        }
    }

    function aiMove(board) {
        console.log('i am calling');
        const emptySquares = board
            .map((val, index) => (val === null ? index : null))
            .filter((val) => val !== null);
        
        if (emptySquares.length === 0) return;
        
        const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        board[randomMove] = "O";
        setSquare([...board]);
        setXIsNext(true);
    }

    function calculateWinner(square) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (square[a] && square[a] === square[b] && square[a] === square[c]) {
                return square[a];
            }
        }
        return null;
    }

    const gameWinner = calculateWinner(square);
    let status = gameWinner ? `Winner: ${gameWinner}` : `Next player: ${xIsNext ? "X" : "O"}`;
    
    // Save score to localStorage when it changes
    useEffect(() => {
        if (gameWinner) {
            setWinner(gameWinner);
            setScore((prevScore) => ({
                ...prevScore,
                [gameWinner]: prevScore[gameWinner] + 1,
            }));
            localStorage.setItem("score", JSON.stringify(setScore));
            setTimeout(resetGame, 3000);
        }else if(square.every(cell => cell !== null)){
            alert("Match Draw");
            setTimeout(resetGame, 1000);
        }
    }, [gameWinner]);

    function resetGame(){
        setSquare(Array(9).fill(null));
        setWinner(null);
    }
    function resetScore(){
        setScore({ X: 0, O: 0 });
        localStorage.setItem("score", JSON.stringify({ X: 0, O: 0 }));
    }

    return (
        <>
            <div className="game-container">
                <button className="info-btn" onClick={() => setIsMachine(!isMachine)}>
                    {isMachine ? "Play with Friend" : "Play with Machine"}
                </button>
                <div className="scoreboard">
                    <p>Player X: {score.X}</p>
                    <p>Player O: {score.O}</p>
                </div>
                <div className="status">{status}</div>
                <br />
                <div className="board">
                    <div className="board-row">
                        <Square value={square[0]} onSquareClick={() => handleClick(0)} />
                        <Square value={square[1]} onSquareClick={() => handleClick(1)} />
                        <Square value={square[2]} onSquareClick={() => handleClick(2)} />
                    </div>
                    <div className="board-row">
                        <Square value={square[3]} onSquareClick={() => handleClick(3)} />
                        <Square value={square[4]} onSquareClick={() => handleClick(4)} />
                        <Square value={square[5]} onSquareClick={() => handleClick(5)} />
                    </div>
                    <div className="board-row">
                        <Square value={square[6]} onSquareClick={() => handleClick(6)} />
                        <Square value={square[7]} onSquareClick={() => handleClick(7)} />
                        <Square value={square[8]} onSquareClick={() => handleClick(8)} />
                    </div>
                </div>
                <button className="reset-btn" onClick={resetGame}>Reset Game</button>
                <button className="reset-btn" onClick={resetScore}>Reset Score</button>

                {gameWinner && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>🎉 Congratulations {gameWinner}! 🎉</h2>
                            <p>You won the game!</p>
                        </div>
                        <div className="balloons">
                            <div className="balloon red"></div>
                            <div className="balloon blue"></div>
                            <div className="balloon green"></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Game;