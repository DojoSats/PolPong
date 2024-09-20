import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 15;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

export default function PongGame() {
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 5, dy: 5 });
  const [leftPaddle, setLeftPaddle] = useState({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [rightPaddle, setRightPaddle] = useState({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [score, setScore] = useState({ left: 0, right: 0 });
  
  const gameLoopRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'w':
          setLeftPaddle(prev => ({ y: Math.max(prev.y - 20, 0) }));
          break;
        case 's':
          setLeftPaddle(prev => ({ y: Math.min(prev.y + 20, GAME_HEIGHT - PADDLE_HEIGHT) }));
          break;
        case 'ArrowUp':
          setRightPaddle(prev => ({ y: Math.max(prev.y - 20, 0) }));
          break;
        case 'ArrowDown':
          setRightPaddle(prev => ({ y: Math.min(prev.y + 20, GAME_HEIGHT - PADDLE_HEIGHT) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();

      // Move ball
      setBall(prev => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Bounce off top and bottom
        if (newY - BALL_SIZE / 2 < 0 || newY + BALL_SIZE / 2 > GAME_HEIGHT) {
          newDy = -newDy;
        }

        // Bounce off paddles
        if (
          (newX - BALL_SIZE / 2 < PADDLE_WIDTH && newY > leftPaddle.y && newY < leftPaddle.y + PADDLE_HEIGHT) ||
          (newX + BALL_SIZE / 2 > GAME_WIDTH - PADDLE_WIDTH && newY > rightPaddle.y && newY < rightPaddle.y + PADDLE_HEIGHT)
        ) {
          newDx = -newDx;
        }

        // Score points
        if (newX < 0) {
          setScore(prev => ({ ...prev, right: prev.right + 1 }));
          newX = GAME_WIDTH / 2;
          newY = GAME_HEIGHT / 2;
        } else if (newX > GAME_WIDTH) {
          setScore(prev => ({ ...prev, left: prev.left + 1 }));
          newX = GAME_WIDTH / 2;
          newY = GAME_HEIGHT / 2;
        }

        return { x: newX, y: newY, dx: newDx, dy: newDy };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [leftPaddle.y, rightPaddle.y]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Modern Pong</h1>
      <div className="mb-4 text-2xl">
        {score.left} - {score.right}
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border-4 border-white rounded-lg"
      />
      <div className="mt-4 flex justify-between w-full max-w-md">
        <div>
          <p className="text-center mb-2">Player 1</p>
          <div className="flex flex-col items-center">
            <button className="bg-blue-500 p-2 rounded-full mb-2">
              <ArrowUp size={24} />
            </button>
            <p className="my-1">W</p>
            <button className="bg-blue-500 p-2 rounded-full mt-2">
              <ArrowDown size={24} />
            </button>
            <p className="mt-1">S</p>
          </div>
        </div>
        <div>
          <p className="text-center mb-2">Player 2</p>
          <div className="flex flex-col items-center">
            <button className="bg-red-500 p-2 rounded-full mb-2">
              <ArrowUp size={24} />
            </button>
            <p className="my-1">↑</p>
            <button className="bg-red-500 p-2 rounded-full mt-2">
              <ArrowDown size={24} />
            </button>
            <p className="mt-1">↓</p>
          </div>
        </div>
      </div>
    </div>
  );
}