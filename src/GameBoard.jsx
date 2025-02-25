import React, { useState, useEffect } from "react";
import "./gameboard.css";

const GameBoard = () => {
  const boardSize = 20;
  const initialSnake = [{ x: 10, y: 10 }];
  const [direction, setDirection] = useState("Right");
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore") || 0);
  const [gameOver, setGameOver] = useState(false);

  const cells = Array.from({ length: boardSize * boardSize });

  const generateFoodPosition = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * boardSize);
      y = Math.floor(Math.random() * boardSize);
    } while (snake.some((segment) => segment.x === x && segment.y === y));
    return { x, y };
  };

  const isSnakeCell = (x, y) => {
    return snake.some((segment) => segment.x === x && segment.y === y);
  };

  const movement = () => {
    if (gameOver) return;

    let newSnake = [...snake];
    const head = newSnake[0];
    let newHead;

    if (direction === "Up") {
      newHead = { x: head.x, y: head.y - 1 };
    } else if (direction === "Down") {
      newHead = { x: head.x, y: head.y + 1 };
    } else if (direction === "Left") {
      newHead = { x: head.x - 1, y: head.y };
    } else if (direction === "Right") {
      newHead = { x: head.x + 1, y: head.y };
    }

    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || 
        snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      if (score > highScore) {
        localStorage.setItem("highScore", score);
        setHighScore(score);
      }
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      newSnake.unshift(newHead);
      setFood(generateFoodPosition());
      setScore(score + 1);
    } else {
      newSnake.unshift(newHead);
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" && direction !== "Down") setDirection("Up");
      else if (event.key === "ArrowDown" && direction !== "Up") setDirection("Down");
      else if (event.key === "ArrowLeft" && direction !== "Right") setDirection("Left");
      else if (event.key === "ArrowRight" && direction !== "Left") setDirection("Right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const intervalSpeed = Math.max(200 - score * 5, 50);
    const interval = setInterval(() => {
      movement();
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [snake, direction, gameOver, score]);

  return (
    <div className="game-container">
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <p>High Score: {highScore}</p>
        </div>
      )}
      <div className="scoreboard">
        <div className="score">Score: {score}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
      <div className="game-board">
        {cells.map((_, index) => {
          const x = index % boardSize;
          const y = Math.floor(index / boardSize);
          const isSnake = isSnakeCell(x, y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`cell ${isSnake ? "snake-cell" : ""} ${isFood ? "food-cell" : ""}`}
              style={{
                left: `${x * 21}px`,
                top: `${y * 21}px`
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
