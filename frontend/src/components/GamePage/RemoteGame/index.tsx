import React, { useEffect, useRef, useState } from 'react'

function newGameState(gameState: GameState) {
  const outOfBounds = (yPosition: number, height: number): boolean => {
    return yPosition < 0 || yPosition + height > gameState.board.height
  }

  const updatePlayer = (player: Player) => {
    if (!outOfBounds(player.y + player.speed, player.height)) {
      player.y += player.speed
    }
    return player
  }

  const updateBall = (ball: Ball) => {
    ball.x += ball.vX
    ball.y += ball.vY

    if (outOfBounds(ball.y, ball.height)) {
      ball.vY *= -1
    }

    if (detectCollision(ball, gameState.player1)) {
      ball.vX *= -1.1
      ball.vY *= 1.1
      gameState.player1.numTouches += 1
    } else if (detectCollision(ball, gameState.player2)) {
      ball.vX *= -1.1
      ball.vY *= 1.1
      gameState.player2.numTouches += 1
    }

    return ball
  }

  const resetGameState = (direction: number): void => {
    gameState.ball = {
      x: (gameState.board.width - gameState.ball.width) / 2,
      y: (gameState.board.height - gameState.ball.height) / 2,
      width: gameState.ball.width,
      height: gameState.ball.height,
      vX: -2,
      vY: 2,
    }
    gameState.player1.numTouches = 0
    gameState.player2.numTouches = 0
  }

  const detectCollision = (ball: Ball, player: Player): boolean => {
    return (
      ball.x <= player.x + player.width &&
      ball.x + ball.width >= player.x &&
      ball.y + ball.height >= player.y &&
      ball.y <= player.y + player.height
    )
  }

  // Update score
  if (gameState.ball.x < 0) {
    gameState.player2Score += 1
    resetGameState(2)
  } else if (gameState.ball.x + gameState.ball.width > gameState.board.width) {
    gameState.player1Score += 1
    resetGameState(-2)
  }

  gameState.player1 = updatePlayer(gameState.player1)
  gameState.player2 = updatePlayer(gameState.player2)
  gameState.ball = updateBall(gameState.ball)

  return gameState
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  speed: number
  numTouches: number
}

interface Ball {
  x: number
  y: number
  width: number
  height: number
  vX: number
  vY: number
}

interface Board {
  width: number
  height: number
}

interface GameState {
  player1: Player
  player2: Player
  ball: Ball
  player1Score: number
  player2Score: number
  board: Board
}

function PongGame() {
  const boardWidth = 800
  const boardHeight = 600
  const playerWidth = 10
  const playerHeight = 90
  const ballWidth = 10
  const ballHeight = 10
  const initialPlayerSpeed = 0

  const [player1, setPlayer1] = useState<Player>({
    x: 10,
    y: (boardHeight - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    speed: initialPlayerSpeed,
    numTouches: 0,
  })

  const [player2, setPlayer2] = useState<Player>({
    x: boardWidth - playerWidth - 10,
    y: (boardHeight - playerHeight) / 2,
    width: playerWidth,
    height: playerHeight,
    speed: initialPlayerSpeed,
    numTouches: 0,
  })

  const [ball, setBall] = useState<Ball>({
    x: (boardWidth - ballWidth) / 2,
    y: (boardHeight - ballHeight) / 2,
    width: ballWidth,
    height: ballHeight,
    vX: 2,
    vY: 2,
  })

  const [player1Score, setPlayer1Score] = useState<number>(0)
  const [player2Score, setPlayer2Score] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'w') {
        setPlayer1((prevState) => ({
          ...prevState,
          speed: -2,
        }))
      } else if (event.key === 's') {
        setPlayer1((prevState) => ({
          ...prevState,
          speed: 2,
        }))
      } else if (event.key === 'ArrowUp') {
        setPlayer2((prevState) => ({
          ...prevState,
          speed: -2,
        }))
      } else if (event.key === 'ArrowDown') {
        setPlayer2((prevState) => ({
          ...prevState,
          speed: 2,
        }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'w' || event.key === 's') {
        setPlayer1((prevState) => ({
          ...prevState,
          speed: initialPlayerSpeed,
        }))
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setPlayer2((prevState) => ({
          ...prevState,
          speed: initialPlayerSpeed,
        }))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
  
    let animationFrameId: number;
  
    const renderGameState = (gameState: GameState) => {
      context.clearRect(0, 0, boardWidth, boardHeight);

      context.fillStyle = 'rebeccapurple';
  
      context.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);
      context.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);
      context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
    }
  
    const gameLoop = () => {
      // Prepare the current game state
      const gameState = {
        player1, player2, ball, player1Score, player2Score,
        board: { width: boardWidth, height: boardHeight },
      };
      const updatedGameState = newGameState(gameState); // simulacao do servidor
  
      renderGameState(updatedGameState);
  
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [player1, player2, ball, player1Score, player2Score, boardWidth, boardHeight]);
  
  return (
    <div>
      <canvas ref={canvasRef} width={boardWidth} height={boardHeight} />
      <button onClick={() => {}}>Start Game</button>
    </div>
  )
}

export default PongGame
