import React, { useState } from 'react';

import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

import styles from './style.module.css';

const ChatRoom = () => {
  const [showLinks, setShowLinks] = useState(true);
  const [showDirectChat, setShowDirectChat] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);

  const handleDirectChatClick = () => {
    setShowLinks(false);
    setShowDirectChat(true);
  };

  const handleChatRoomClick = () => {
    setShowLinks(false);
    setShowChatRoom(true);
  };

  return (
    <div>
      {showLinks && (
        <div className={styles.container}>
          <button onClick={handleDirectChatClick}>Create a New Chat Room</button>
          <button onClick={handleChatRoomClick}>Join an existing Room</button>
        </div>
      )}
      {showDirectChat && <CreateRoom />}
      {showChatRoom && <JoinRoom />}
    </div>
  );
};

export default ChatRoom;
