import './chatboxComponent.css';

const ChatboxComponent = (props) => {
    return (
        <div class="settings-content">
            <span class="chat-title font-italic text-center">Chat Box</span>
            <div class="settings-vertical">
                <div class="container">
                    <p class="container-name">Player 1</p>
                    <p>Hello. How are you ?</p>
                    <span class="time-right">11:00</span>
                </div>

                <div class="container darker">
                    <p class="container-name">Player 2</p>
                    <p>Hey! I'm fine.</p>
                    <span class="time-left">11:01</span>
                </div>

                <div class="container">
                    <p class="container-name">Player 1</p>
                    <p>what do you wanna do today?</p>
                    <span class="time-right">11:02</span>
                </div>
                <div class="container darker">
                    <p class="container-name">Player 2</p>
                    <p>Play soccer</p>
                    <span class="time-left">11:05</span>
                </div>
            </div>
        </div>

    );
}

export default ChatboxComponent;