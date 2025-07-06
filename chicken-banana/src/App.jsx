import React, { useState } from 'react';
import './App.css';

const gridSize = 6;
const totalTiles = gridSize * gridSize;

function generateBoard() {
  const half = totalTiles / 2;
  const mixed = Array(half).fill('banana').concat(Array(half).fill('chicken'));
  return mixed.sort(() => Math.random() - 0.5);
}

function App() {
  const [board, setBoard] = useState(generateBoard());
  const [clicked, setClicked] = useState([]);
  const [playerType, setPlayerType] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const handleTileClick = (index) => {
    if (gameOver || clicked.includes(index) || !playerType) return;

    const selected = board[index];
    if (selected === playerType) {
      const newClicked = [...clicked, index];
      setClicked(newClicked);
      setScore(score + 1);
      const playerTotal = board.filter(t => t === playerType).length;
      if (newClicked.filter(i => board[i] === playerType).length === playerTotal) {
        setMessage(`🎉 ${playerType.toUpperCase()} wins with perfect clicks!`);
        setGameOver(true);
      }
    } else {
      setClicked([...clicked, index]);
      setMessage(`💥 Wrong! You clicked a ${selected}. ${playerType.toUpperCase()} loses.`);
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setBoard(generateBoard());
    setClicked([]);
    setScore(0);
    setMessage('');
    setGameOver(false);
    setPlayerType(null);
  };

  return (
    <div className="container">
      <h1>🐔🍌 Chicken Banana Game</h1>
      {!playerType && (
        <div className="buttons">
          <button onClick={() => setPlayerType('banana')}>I’m the 🍌</button>
          <button onClick={() => setPlayerType('chicken')}>I’m the 🐔</button>
        </div>
      )}
      {playerType && <h2>Player: {playerType.toUpperCase()} | Score: {score}</h2>}
      <div className="grid">
        {board.map((item, i) => (
          <div key={i} className="tile" onClick={() => handleTileClick(i)}>
            <span className="tile-number">{i + 1}</span>
            {clicked.includes(i) && item === 'banana' && (
              <img src="/banana.png" alt="banana" className="image" />
            )}
            {clicked.includes(i) && item === 'chicken' && (
              <img src="/chicken.png" alt="chicken" className="image" />
            )}
          </div>
        ))}
      </div>
      {message && <h3>{message}</h3>}
      {(message || gameOver) && (
        <button className="restart" onClick={restartGame}>
          🔁 Restart
        </button>
      )}
    </div>
  );
}

export default App;
