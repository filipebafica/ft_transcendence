import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import Score from './Score'
import Board from './Board'

import fans0 from '../../../assets/fan_0.png'
import fans1 from '../../../assets/fan_1.png'
import fans2 from '../../../assets/fan_2.png'
import fans3 from '../../../assets/fan_3.png'
const fansArr = [fans0, fans1, fans2, fans3]

interface PlayersProps {
  gameState: any
  playerId: string
}

function PongGame(props: PlayersProps) {
  const gameState = props.gameState

  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const BoardContainer = () => {
    return (
      <div className={styles.board}>
        <div className={styles.fans}>
          <div className={styles.playerFans1}>
            <img
              src={fansArr[gameState.player1.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player1.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player1.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player1.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
          </div>
          <div className={styles.playerFans2}>
            <img
              src={fansArr[gameState.player2.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player2.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player2.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
            <img
              src={fansArr[gameState.player2.customization.fans]}
              alt=""
              className={styles.jumpingImage}
            />
          </div>
        </div>
        <Board gameState={gameState} playerId={props.playerId} />
      </div>
    )
  }

  if (windowSize[0] > 900)
    return (
      <div className={styles.screen}>
        <Score player={gameState.player1.name} score={gameState.player1Score} />
        {BoardContainer()}
        <Score player={gameState.player2.name} score={gameState.player2Score} />
      </div>
    )

  return (
    <div className={styles.screenVertical}>
      {BoardContainer()}
	  <div className={styles.screenVerticalScore}>
      	<Score player={gameState.player1.name} score={gameState.player1Score} />
      	<Score player={gameState.player2.name} score={gameState.player2Score} />
	  </div>
    </div>
  )
}

export default PongGame
