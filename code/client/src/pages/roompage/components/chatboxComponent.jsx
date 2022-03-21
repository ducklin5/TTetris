import './chatboxComponent.css';

const ChatboxComponent = (props) => {
    return (
        <div className="chatbox-content">
            <span className="chat-title font-italic text-center">Chat Box</span>
            <div className="messages-container">
                <div className="container">
                    <span className="container-name-left">P1</span>
                    <p>Hello. How are you ?</p>
                    <span className="time-right">11:00</span>
                </div>
                <div className="container darker">
                    <span className="container-name-right">Me</span>
                    <p>Hey! I'm fine.</p>
                    <span className="time-left">11:01</span>
                </div>
            </div>
            <div className='send-box'>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Type..." aria-label="Type" aria-describedby="basic-addon2"></input>
                    <div className="input-group-append">
                        <button className="btn send-button" type="button">Send</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ChatboxComponent;