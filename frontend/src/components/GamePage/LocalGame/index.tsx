import React, { useEffect, useRef, useState } from 'react'

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

  const outOfBounds = (yPosition: number, height: number): boolean => {
    return yPosition < 0 || yPosition + height > boardHeight
  }

  const detectCollision = (ball: Ball, player: Player): boolean => {
    return (
      ball.x <= player.x + player.width &&
      ball.x + ball.width >= player.x &&
      ball.y + ball.height >= player.y &&
      ball.y <= player.y + player.height
    )
  }

  const resetGameState = (direction: number): void => {
    setBall({
      x: (boardWidth - ballWidth) / 2,
      y: (boardHeight - ballHeight) / 2,
      width: ballWidth,
      height: ballHeight,
      vX: direction,
      vY: 2,
    })
    setPlayer1((prev) => ({ ...prev, numTouches: 0 }))
    setPlayer2((prev) => ({ ...prev, numTouches: 0 }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    let animationFrameId: number

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') {
        setPlayer1((prev) => ({ ...prev, speed: -3 }))
      } else if (event.code === 'KeyS') {
        setPlayer1((prev) => ({ ...prev, speed: 3 }))
      }
      if (event.code === 'ArrowUp') {
        setPlayer2((prev) => ({ ...prev, speed: -3 }))
      } else if (event.code === 'ArrowDown') {
        setPlayer2((prev) => ({ ...prev, speed: 3 }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyW' || event.code === 'KeyS') {
        setPlayer1((prev) => ({ ...prev, speed: 0 }))
      }
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        setPlayer2((prev) => ({ ...prev, speed: 0 }))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    const updateGame = () => {
      // Clear the canvas
      context.clearRect(0, 0, boardWidth, boardHeight)

      // Update and render player positions
      const updatePlayer = (player: Player) => {
        if (!outOfBounds(player.y + player.speed, player.height)) {
          player.y += player.speed
        }
        context.fillRect(player.x, player.y, player.width, player.height)
      }

      updatePlayer(player1)
      updatePlayer(player2)

      // Update and render ball position
      ball.x += ball.vX
      ball.y += ball.vY
      context.fillRect(ball.x, ball.y, ball.width, ball.height)

      // Collision detection with top and bottom walls
      if (outOfBounds(ball.y, ball.height)) {
        ball.vY *= -1
      }

      // Collision detection with players
      if (detectCollision(ball, player1)) {
        ball.vX *= -1.1
        ball.vY *= 1.1
        setPlayer1((prev) => ({ ...prev, numTouches: prev.numTouches + 1 }))
      } else if (detectCollision(ball, player2)) {
        ball.vX *= -1.1
        ball.vY *= 1.1
        setPlayer2((prev) => ({ ...prev, numTouches: prev.numTouches + 1 }))
      }

      // Update scores and reset if the ball goes off-screen
      if (ball.x < 0) {
        setPlayer2Score((score) => score + 1)
        resetGameState(2)
      } else if (ball.x + ball.width > boardWidth) {
        setPlayer1Score((score) => score + 1)
        resetGameState(-2)
      }

      // Render scores
      context.font = '45px sans-serif'
      context.fillText(player1Score.toString(), boardWidth / 5, 45)
      context.fillText(player2Score.toString(), (boardWidth * 4) / 5 - 45, 45)

      // Request the next frame
      animationFrameId = requestAnimationFrame(updateGame)
    }

    // Start the game loop
    updateGame()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [player1, player2, ball, player1Score, player2Score])

  return (
    <div>
      <canvas ref={canvasRef} width={boardWidth} height={boardHeight} />
      <button onClick={() => {}}>Start Game</button>
    </div>
  )
}

export default PongGame
