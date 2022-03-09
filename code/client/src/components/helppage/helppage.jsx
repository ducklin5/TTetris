import React, { Component } from 'react';
import './helppage.css';

class HelpPage extends Component {

    render() { 
        return ( 
            <div class="help-page">
                <p class="h1 text-danger font-weight-bold font-italic text-center title-margin ">Treacherous Tetris</p>
                <div class="help-col">
                    <div class="help-sections">
                        <div class="help-box">
                            <div class="help-text">
                                <span class="help-box-title font-italic">Tetris Rules</span>
                                <p class="help-box-paragraph"> There are certain rules that must be followed in this game</p>
                                <ul class="help-box-paragraph">
                                    <li>Rules</li>
                                    <li>Voting</li>
                                    <li>Pieces</li>
                                </ul>
                            </div>
                        </div>
                
                        <div class="help-box">
                            <div class="help-text">
                                <span class="help-box-title font-italic">Settings Help</span>
                                <p class="help-box-paragraph"> TTetris allows both hosts and players to modify their settings</p>
                                <ul class="help-box-paragraph">
                                    <li>Game Settings</li>
                                    <li>Player Settings</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="help-sections">
                        <div class="help-box">
                            <div class="help-text">
                                <span class="help-box-title font-italic">Chat Box</span>
                                <p class="help-box-paragraph"> Players are able to send messages to each other during the game</p>
                            </div>
                        </div>

                        <div class="help-box">
                            <div class="help-text">
                                <span class="help-box-title font-italic">Voice Chat</span>
                                <p class="help-box-paragraph"> Players are able to use the voice chat feature to communicate with
                                    each other during the game</p>
                            </div>
                        </div>
                    </div>             
                </div>
            </div>
        );
    }
}
 
export default HelpPage;