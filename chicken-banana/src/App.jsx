import React, { useState, useEffect } from 'react';
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
  const [revealed, setRevealed] = useState([]); // NEW

  useEffect(() => {
    if (gameOver) {
      // Start by revealing only the clicked tiles
      setRevealed([...clicked]);
      // After a short delay, reveal all tiles
      const timeout = setTimeout(() => {
        setRevealed(board.map((_, idx) => idx));
      }, 600); // 600ms delay before revealing all
      return () => clearTimeout(timeout);
    } else {
      setRevealed([]); // Reset on restart
    }
  }, [gameOver, clicked, board]);

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
    setRevealed([]);
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
            {!clicked.includes(i) && !gameOver && (
              <span className="tile-number">{i + 1}</span>
            )}
            {(clicked.includes(i) || (gameOver && revealed.includes(i))) && item === 'banana' && (
              <img src="/banana.png" alt="banana" className="image" />
            )}
            {(clicked.includes(i) || (gameOver && revealed.includes(i))) && item === 'chicken' && (
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
      {clicked.length > 0 && (
        <div className="clicked-tiles-tab">
          <strong>Clicked Tiles:</strong>
          <div className="clicked-tiles-list">
            {clicked.map(i => (
              <span key={i} className="clicked-tile-number">{i + 1}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
