import React, { useState } from 'react'
import styles from './style.module.css'

import LocalGame from './LocalGame'
import RemoteGame from './RemoteGame'

interface GamePageProps {
  // Define the props for the GamePage component here
}

function GamePage(props: GamePageProps) {
  const [game, setGame] = useState<boolean>(true);

  const handleSwitchGame = () => {
    setGame(!game);
  };

  return (
    <div>
      {game ? <LocalGame /> : <RemoteGame/>}
      <button onClick={handleSwitchGame}>Switch Game</button>
    </div>
  );
}

export default GamePage;
