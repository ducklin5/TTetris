import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './chatboxComponent.css';
import MessageBoxComponent from './messageBoxComponent';

const ChatboxComponent = (props) => {
    const {socket} = props;
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const roomID = useParams().roomID;

    useEffect(() => {
        socket.emit("getMessage", roomID, (chatHistory) => {
            setChatHistory(chatHistory);
        })
    },[])

    socket.on("sendMessageAll", (chatHistory) => {
        setChatHistory(chatHistory);
    })

    const onMessageChanged = (event) => {
        setMessage(event.target.value);
    }
    
    const onMessageSendClicked = () => {
        socket.emit("sendMessage", roomID, message, window.clientID, () => {
            setMessage("");
        })
    }

    return (
        <div className="chatbox-content">
            <span className="chat-title font-italic text-center">Chat Box</span>
            <div className='messages-container'>
                {
                    chatHistory.map(chat => 
                        <MessageBoxComponent message={chat.message} nickname={chat.nickname} time={chat.time}/>
                    )
                }
            </div>
            <div className='send-box'>
                <div className="input-group mb-3">
                    <input type="text" value={message} onChange={onMessageChanged} className="form-control" placeholder="Type..." aria-label="Type" aria-describedby="basic-addon2"></input>
                    <div className="input-group-append">
                        <button onClick={onMessageSendClicked} className="btn send-button" type="button">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatboxComponent;