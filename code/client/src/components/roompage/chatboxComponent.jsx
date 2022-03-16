import './chatboxComponent.css';

const ChatboxComponent = (props) => {
    return (
        <div className="settings-content">
            <span className="chat-title font-italic text-center">Chat Box</span>
            <div className="settings-vertical">
                <div className="container">
                    <p className="container-name">Player 1</p>
                    <p>Hello. How are you ?</p>
                    <span className="time-right">11:00</span>
                </div>
                <div className="container darker">
                    <p className="container-name">Player 2</p>
                    <p>Hey! I'm fine.</p>
                    <span className="time-left">11:01</span>
                </div>
                <div className="container">
                    <p className="container-name">Player 1</p>
                    <p>what do you wanna do today?</p>
                    <span className="time-right">11:02</span>
                </div>
                <div className="container darker">
                    <p className="container-name">Player 2</p>
                    <p>Play soccer</p>
                    <span className="time-left">11:05</span>
                </div>
            </div>
        </div>
    );
}

export default ChatboxComponent;