import PropTypes from "prop-types";

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const RoomPage = (props) => {
    const {socket} = props;

    return (
        <>
        </>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;