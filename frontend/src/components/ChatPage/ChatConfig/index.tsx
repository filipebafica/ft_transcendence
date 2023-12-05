import React, { useState } from 'react';
import ChatRoom from '../ChatRoom'; // Import the ChatRoom component

const ChatConfig = () => {
  const [userFrom, setUserFrom] = useState({ name: '', id: '' });
  const [userTo, setUserTo] = useState({ name: '', id: '' });
  const [isConfigComplete, setIsConfigComplete] = useState(false);

  const handleStartChat = () => {
    if (userFrom.name && userTo.name) {
      setIsConfigComplete(true);
    } else {
      alert('Please enter both user names');
    }
  };

  if (isConfigComplete) {
    return <ChatRoom userFrom={userFrom} userTo={userTo} />;
  }

  return (
    <div>
      <input
        type="text"
        value={userFrom.name}
        onChange={(e) => setUserFrom({ ...userFrom, name: e.target.value })}
        placeholder="Your Name"
      />
      <input
        type="text"
        value={userTo.name}
        onChange={(e) => setUserTo({ ...userTo, name: e.target.value })}
        placeholder="Recipient Name"
      />
      <button onClick={handleStartChat}>Start Chat</button>
    </div>
  );
};

export default ChatConfig;