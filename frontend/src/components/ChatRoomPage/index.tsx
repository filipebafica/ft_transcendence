import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './style.module.css';

// Api
import { listMyRooms } from 'api/chat';

// Components
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// Context
import { AuthContext } from 'auth';

interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  password?: string;
}

const ChatRoomPage = () => {
  const [myRooms, setMyRooms] = useState([] as Room[]);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleCreateRoom = () => {
    navigate('/chatRoom/createRoom');
  };

  const handleJoinRoom = () => {
    navigate('/chatRoom/joinRoom');
  };

  const handleChatRoomClick = (roomId: string) => {

  };

  useEffect(() => {
    let rooms 
    const fetchRooms = async () => {
      try {
        const response = await listMyRooms(user?.id || '');
        console.log('Rooms:', response.data);
        rooms = response.data;
        setMyRooms(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, [user]);

  return (
    <div className={styles.container}>
        <div className={styles.roomsContainer}>
          <h2> Your Rooms: </h2>
          {
            myRooms.length === 0 && <><i> No rooms available. </i> <i>Create or join an existing room! </i> </>
          }
          {
            myRooms.map((room) => (
              <Button variant="contained" onClick={() => handleChatRoomClick(room.id)}>
                {room.name}
              </Button>
            ))
          }
        </div>
        <Divider orientation="vertical" flexItem />
        <div className={styles.actionsContainer}>
          <Button variant="outlined" onClick={handleCreateRoom}>
            Create a Room
          </Button>
          <Button variant="outlined" onClick={handleJoinRoom}>
            Join a new Room
          </Button>
        </div>
    </div>
  );
};

export default ChatRoomPage;
