import React, { useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            let now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();

            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            let formattedTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
            const messageData = {
                id: Math.random(),
                room: room,
                author: username,
                message: currentMessage,
                // time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
                time: formattedTime
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");

        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        socket.on("user_joined", (user) => {
            console.log('data for join room is: ', user);
            let userObj = {
                user,
                id: Math.random(),
                isUserActivity: true
            }
            setMessageList((list) => [...list, userObj]);
        })
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div


                            >
                                {
                                    !messageContent.isUserActivity ?
                                        (
                                            <div key={messageContent.id}
                                                className="message"
                                                id={username === messageContent.author ? "you" : "other"}>
                                                <div>
                                                    <div className="message-content">
                                                        <p>{messageContent.message}</p>
                                                    </div>
                                                    <div className="message-meta">
                                                        <p id="time">{messageContent.time}</p>
                                                        <p id="author">{username === messageContent.author ? 'You' : messageContent.author}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        :
                                        <div key={messageContent.id}>
                                            <div id="user-activity" className='user_activity_content'>
                                                <p>{messageContent.user} has joined the chat</p>
                                            </div>
                                        </div>

                                }

                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div >
            <div className='chat-footer'>
                <input type="text" placeholder='hey...' value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)} onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                }} />
                <button style={{ color: currentMessage.length ? '#43a047' : '' }} onClick={sendMessage}>&#9658;</button>
            </div>
        </div >
    );
};

export default Chat;
