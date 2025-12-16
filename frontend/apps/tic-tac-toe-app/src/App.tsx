import { useState } from 'react';
import Player from './components/Player';
import GameBoard from './components/GameBoard';
import Log from './components/Log';
import GameOver from './components/GameOver';
import { WINNING_COMBINATIONS } from './winning-combinations';

type Turn = {
    square: {
        row: number;
        col: number;
    };
    player: string;
};
type GameTurns = Array<Turn>;
type Row = Array<string | null>;
type Board = Row[];

const INITIAL_GAME_BOARD: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

type PlayerNames = {
    X: string;
    O: string;
};

const PLAYERS: PlayerNames = {
    X: 'Player 1',
    O: 'Player 2',
};

const deriveActivePlayer = (turns: GameTurns) => {
    let activePlayer = 'X';
    if (turns.length > 0 && turns[0].player === 'X') {
        activePlayer = 'O';
    }
    return activePlayer;
};

const deriveWinner = (gameBoard: Board, players: PlayerNames) => {
    let winner = null;
    for (const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].col];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].col];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].col];
        if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
            // type narrowing
            // if (typeof firstSquareSymbol === 'string' && (firstSquareSymbol === 'X' || firstSquareSymbol === 'O')) {
            //     winner = playerNames[firstSquareSymbol];
            // }
            // type assertion
            winner = players[firstSquareSymbol as keyof typeof players];
        }
    }
    return winner;
};

const deriveGameBoard = (turns: GameTurns) => {
    const gameBoard = [...INITIAL_GAME_BOARD.map((row) => [...row])];
    for (const turn of turns) {
        const { square, player } = turn;
        const { row, col } = square;
        gameBoard[row][col] = player;
    }
    return gameBoard;
};

function App() {
    const [gameTurns, setGameTurns] = useState<GameTurns>([]);
    const [playerNames, setPlayerNames] = useState<PlayerNames>(PLAYERS);

    const gameBoard = deriveGameBoard(gameTurns);
    const activePlayer = deriveActivePlayer(gameTurns);
    const winner = deriveWinner(gameBoard, playerNames);

    const hasDraw = gameTurns.length === 9 && !winner;

    const handleSelectSquare = (rowIndex: number, colIndex: number) => {
        setGameTurns((prevGameTurns) => {
            const currentPlayer = deriveActivePlayer(prevGameTurns);
            const updatedTurns = [
                {
                    square: {
                        row: rowIndex,
                        col: colIndex,
                    },
                    player: currentPlayer,
                },
                ...prevGameTurns,
            ];
            return updatedTurns;
        });
    };

    const handleRestartGame = () => {
        setGameTurns([]);
    };

    const handlePlayerNameChange = (playerSymbol: string, newName: string) => {
        setPlayerNames((prevPlayerNames) => {
            return {
                ...prevPlayerNames,
                [playerSymbol]: newName,
            };
        });
    };

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        initName={PLAYERS.X}
                        symbol="X"
                        isActive={activePlayer === 'X'}
                        onChangeName={handlePlayerNameChange}
                    />
                    <Player
                        initName={PLAYERS.O}
                        symbol="O"
                        isActive={activePlayer === 'O'}
                        onChangeName={handlePlayerNameChange}
                    />
                </ol>
                {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestartGame} />}
                <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
            </div>
            <Log turns={gameTurns} />
        </main>
    );
}

export default App;
