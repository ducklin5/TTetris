import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import PropTypes from "prop-types";

const HomePagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const HomePage = (props) => {
    const [roomID, setRoomID] = useState("");
    const {socket} = props;
    console.log(socket)

    const onCreateButtonClicked = () => {
        const roomID = "abcd";
        socket.emit("create_room", roomID, (msg) => {
            console.log(msg);
            console.log("room created");
        })
    }

    const onJoinButtonClicked = () => {
        requestJoinRoom(roomID);
    }

    const requestJoinRoom = (roomID) => {
        socket.emit("join_room", roomID, () => {
            console.log("room joined");
        })
    }

    return (   
            <div className="home-page">
                <p className="h1 text-danger font-weight-bold font-italic text-center title-margin ">Treacherous Tetris</p>
                <div className="d-flex justify-content-center align-items-start">
                    <button onClick={onCreateButtonClicked} type="button" className="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                        Create Room
                    </button>
                </div>
                <div className="d-flex justify-content-center align-items-start">
                    <input onChange={(event) => {
                        setRoomID(event.target.value)
                    }} type="text" placeholder='Enter RoomID'></input>
                    <button onClick={onJoinButtonClicked} type="button" className="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                        Join Room
                    </button>
                </div>
                <div className="d-flex justify-content-center align-items-start">
                    <Link to={"/help"} type="button" className="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                        Help
                    </Link>
                </div>
            </div>
    );
}
 
HomePage.propTypes = HomePagePropTypes;

export default HomePage;