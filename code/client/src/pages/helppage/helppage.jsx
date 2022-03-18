import React, { Component } from 'react';
import './helppage.css';

class HelpPage extends Component {

    render() { 
        return ( 
            <div className="help-page">
                <div className="piece piece-1"></div>
                <div className="piece piece-2"></div>
                <div className="piece piece-3"></div>
                <div className="piece piece-4"></div>
                <div className="piece piece-5"></div>
                <div className="piece piece-6"></div>
                <div><p className="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p></div>
                <div className="help-col">
                    <div className="help-sections">
                        <div className="help-box-left">
                            <div className="help-text">
                                <span className="help-box-title font-italic">TTetris Rules</span>
                                <p className="help-box-paragraph"> Below is a summary of TTetris game for new players:</p>
                                <ul className="help-box-paragraph">
                                    <li><strong>Rules:</strong> Active players can move Tetris pieces as they collaborate with each other to complete/remove 20 rows to win the game session. </li>
                                    <li><strong>Voting:</strong> voting session can be started by pressing the emergency button to find the imposter.
                                    The player with the majority of votes will be exiled. In case of a tie, no player
                                    will be exiled.</li>
                                    <li><strong>Pieces:</strong> there are 7 Tetrominoes I, J, L, O, S, Z, T. They can be moved to left, right and down.</li>
                                    <li><strong>Players:</strong> there are 3 types of players in TTetris: <em>Civilans</em> are regular players in the game who collaborate with each other to win.
                                    <em> Imposter</em> tries to prevent civilains from winning by interfering with row completion and changing the progress bar. <em>Exiled</em> is the player who is voted out during Emergency voting session.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="help-sections">
                        <div className="help-box-right">
                            <div className="help-text">
                                <span className="help-box-title font-italic">Settings Help</span>
                                <p className="help-box-paragraph"> TTetris allows both hosts and players to modify their settings.</p>
                                <ul className="help-box-paragraph">
                                    <li><strong>Host Settings:</strong> the host can create a game room and set the game level which determines the speed of pieces.
                                        They are able to start the game session by pressing the Start button.
                                    </li>
                                    <li><strong>Player Settings:</strong> players can type a nickname for themselves and choose the color of their pieces.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="help-box-right">
                            <div className="help-text">
                                <span className="help-box-title font-italic">Chat Box</span>
                                <p className="help-box-paragraph"> Players are able to send messages to each other during the game using the chat box.</p>
                            </div>
                        </div>

                        <div className="help-box-right">
                            <div className="help-text">
                                <span className="help-box-title font-italic">Voice Chat</span>
                                <p className="help-box-paragraph"> Players are able to use the voice chat feature to communicate with
                                    each other during the game.</p>
                            </div>
                        </div>
                    </div>             
                </div>
            </div>
        );
    }
}

export default HelpPage;