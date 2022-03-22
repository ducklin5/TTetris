
const MessageBoxComponent = (props) => {
    const {nickname, message, time} = props;

    return (
        <>
            <div className="container">
                <span className="container-name-left">{nickname}</span>
                <p>{message}</p>
                <span className="time-right">{time}</span>
            </div>
            {/* <div className="container darker">
                <span className="container-name-right">Me</span>
                <p>Hey! I'm fine.</p>
                <span className="time-left">11:01</span>
            </div> */}
        </>
    )
}

export default MessageBoxComponent;