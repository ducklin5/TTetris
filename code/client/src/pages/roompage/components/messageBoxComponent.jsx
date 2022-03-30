import "./messageBoxComponent.css";

const MessageBoxComponent = (props) => {
    const {nickname, message, time} = props;

    return (
        <>
            <div className="container">
                <span className="container-name-left">{nickname}</span>
                <p style={{"color":"#fff"}}>{message}</p>
                <span className="time-right">{time}</span>
            </div>
        </>
    )
}

export default MessageBoxComponent;