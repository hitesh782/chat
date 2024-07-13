
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showchat, setShowchat] = useState('');

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      let userObj = {
        username: username,
        room: room
      }
      socket.emit("join_room", userObj);
      setShowchat(true);
    }
  }

  return (
    <div className="App">
      {!showchat ? (
        <div className='joinChatContainer'>
          <h3>Join a Chat</h3>
          <input type="text" placeholder="name..." onChange={(event) => setUsername(event.target.value)} />
          <input type="text" placeholder="Room Id..." onChange={(event) => setRoom(event.target.value)} />
          <button onClick={joinRoom}>join a Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )
      }
    </div>
  );
}

export default App;
