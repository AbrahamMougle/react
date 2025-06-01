
import { useState, useEffect, type JSX } from "react"
import Square from "./component/Square"
interface BoardProps {
  xIsNext: boolean;
  squareState: string[];
  onPlay: (nextSquares: string[]) => void;
}
function Board({ xIsNext, squareState, onPlay}: BoardProps): JSX.Element {
  const winnerInfo = calculateWinner(squareState);
  const winnergame = winnerInfo?.player;
  const winningLine = winnerInfo?.line ?? [];

  function handleClick(i: number) {
    if (squareState[i] || calculateWinner(squareState)) {

      return;
    }
    const nextSquares = squareState.slice();
    if (xIsNext) {
      nextSquares[i] = 'x';

    } else {
      nextSquares[i] = 'o';
    }
    onPlay(nextSquares);

  }
 



  return <div>


    <div className="flex ">
      <div>
        <Square value={squareState[0]} highlight={winningLine.includes(0)} onSquareClick={() => handleClick(0)} />
        <Square value={squareState[1]} highlight={winningLine.includes(1)} onSquareClick={() => handleClick(1)} />
        <Square value={squareState[2]} highlight={winningLine.includes(2)} onSquareClick={() => handleClick(2)} />
      </div>
      <div>
        <Square value={squareState[3]} highlight={winningLine.includes(3)} onSquareClick={() => handleClick(3)} />
        <Square value={squareState[4]} highlight={winningLine.includes(4)} onSquareClick={() => handleClick(4)} />
        <Square value={squareState[5]} highlight={winningLine.includes(5)} onSquareClick={() => handleClick(5)} />
      </div>
      <div>
        <Square value={squareState[6]} highlight={winningLine.includes(6)} onSquareClick={() => handleClick(6)} />
        <Square value={squareState[7]} highlight={winningLine.includes(7)} onSquareClick={() => handleClick(7)} />
        <Square value={squareState[8]} highlight={winningLine.includes(8)} onSquareClick={() => handleClick(8)} />
      </div>

    </div>
    {
      winnergame ? (
        <div className="mt-4 text-2xl font-bold">
          Le gagnant est : {winnergame}
        </div>
      ) : isBoardFull(squareState) ? (
        <div className="mt-4 text-2xl font-bold">
          Match nul !
        </div>
      ) : (
        <div className="mt-4 text-2xl font-bold">
          Prochain joueur : {xIsNext ? 'X' : 'O'}
        </div>
      )
    }
  </div>
}

export default function App(): JSX.Element {

  const [history, setHistory] = useState<string[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(nextSquares: string[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  useEffect(() => {
  if (isBoardFull(currentSquares) || calculateWinner(currentSquares)) {
    setTimeout(() => {
      setHistory([Array(9).fill('')]);
      setCurrentMove(0);
    }, 1500); 
  }
}, [currentSquares]);
  // la fonction jumpTo permet de revenir à un coup précédent et de mettre à jour l'état du jeu

  function jumpTo(nextMove: number) {
    // On vérifie si le dernier plateau de l'historique a un gagnant
    const lastBoard = history[history.length - 1];
    if (calculateWinner(lastBoard)) {
      alert("Le jeu est terminé, vous ne pouvez pas revenir en arrière.");
      return;
    }
    setCurrentMove(nextMove);
  }
  // le nombre de bouton stocker dans move  est égal au nombre de coups joués
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return <div className="p-4">
    <div>
      <h1 className="text-2xl font-bold mb-4">Jeu de Tic Tac Toe</h1>
      <h2 className="mb-4 text-2xl font-medium ">Joueur actuel: {xIsNext ? 'X' : 'O'}</h2>
    </div>
    <Board xIsNext={xIsNext} squareState={currentSquares} onPlay={handlePlay}/>
    <h2>Historique des coups</h2>
    <ol>{moves}</ol>
  </div>
}
function calculateWinner(squares: string[]): {player: string, line: number[]} | null {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
function isBoardFull(array: string[]): boolean {
  return array.every(cell => cell); // retourne true si toutes les cases sont "truthy"
}