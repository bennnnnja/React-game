import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const createGrid = () => {
    const newGrid = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push(Math.floor(Math.random() * 5));
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    createGrid();
  }, []);

  const handleClick = (row, col) => {
    if (selected) {
      const [selectedRow, selectedCol] = selected;
      if (Math.abs(selectedRow - row) + Math.abs(selectedCol - col) === 1) {
        swap(selectedRow, selectedCol, row, col);
      }
      setSelected(null);
    } else {
      setSelected([row, col]);
    }
  };

  const swap = (row1, col1, row2, col2) => {
    const newGrid = grid.map(row => row.slice());
    [newGrid[row1][col1], newGrid[row2][col2]] = [newGrid[row2][col2], newGrid[row1][col1]];
    setGrid(newGrid);
    checkMatches(newGrid);
  };

  const checkMatches = (newGrid) => {
    const matches = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newGrid[i][j] !== null) {
          if (i < 6 && newGrid[i][j] === newGrid[i + 1][j] && newGrid[i][j] === newGrid[i + 2][j]) {
            matches.push([i, j]);
          }
          if (j < 6 && newGrid[i][j] === newGrid[i][j + 1] && newGrid[i][j] === newGrid[i][j + 2]) {
            matches.push([i, j]);
          }
        }
      }
    }
    if (matches.length > 0) {
      removeMatches(newGrid, matches);
    }
  };

  const removeMatches = (newGrid, matches) => {
    matches.forEach(([row, col]) => {
      if (row < 6 && newGrid[row][col] === newGrid[row + 1][col] && newGrid[row][col] === newGrid[row + 2][col]) {
        newGrid[row][col] = newGrid[row + 1][col] = newGrid[row + 2][col] = null;
      }
      if (col < 6 && newGrid[row][col] === newGrid[row][col + 1] && newGrid[row][col] === newGrid[row][col + 2]) {
        newGrid[row][col] = newGrid[row][col + 1] = newGrid[row][col + 2] = null;
      }
    });
    setScore(score + matches.length * 10);
    gravity(newGrid);
  };

  const gravity = (newGrid) => {
    for (let j = 0; j < 8; j++) {
      let emptyRow = 7;
      for (let i = 7; i >= 0; i--) {
        if (newGrid[i][j] !== null) {
          [newGrid[emptyRow][j], newGrid[i][j]] = [newGrid[i][j], newGrid[emptyRow][j]];
          emptyRow--;
        }
      }
    }
    fillEmptyCells(newGrid);
  };

  const fillEmptyCells = (newGrid) => {
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        if (newGrid[i][j] === null) {
          newGrid[i][j] = Math.floor(Math.random() * 5);
        }
      }
    }
    setGrid(newGrid);
    checkMatches(newGrid);
  };

  return (
    <div className="app">
      <h1>Три в ряд</h1>
      <h2>Очки: {score}</h2>
      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`cell ${selected && selected[0] === i && selected[1] === j ? 'selected' : ''}`}
                onClick={() => handleClick(i, j)}
              >
                {cell !== null ? <div className={`gem gem-${cell}`} /> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;