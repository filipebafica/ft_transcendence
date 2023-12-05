import React, { useState } from 'react';

import ChatRoom from './ChatRoom';
import DirectChat from './DirectChat';

import styles from './style.module.css';

const ChatPage = () => {
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
          <button onClick={handleDirectChatClick}>Direct Chat</button>
          <button onClick={handleChatRoomClick}>Chat Room</button>
        </div>
      )}
      {showDirectChat && <DirectChat />}
      {showChatRoom && <ChatRoom />}
    </div>
  );
};

export default ChatPage;
