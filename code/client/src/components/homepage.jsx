import React, { Component } from 'react';
import './homepage.css';

class HomePage extends Component {

    clicked() {
        alert('Button clicked!');
    }
    render() { 
        return (   
                <div class="home-page">
                    <p class="h1 text-danger font-weight-bold font-italic text-center title-margin ">Treacherous Tetris</p>
                    <div class="d-flex justify-content-center align-items-start">
                        <button onClick={this.clicked} type="button" class="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                            Create Room
                        </button>
                    </div>
                    <div class="d-flex justify-content-center align-items-start">
                        <button onClick={this.clicked} type="button" class="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                            Join Room
                        </button>
                        </div>
                        <div class="d-flex justify-content-center align-items-start">
                        <button onClick={this.clicked} type="button" class="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic text-center btn-space">
                            Help
                        </button>
                    </div>
                </div>
        );
    }
}
 
export default HomePage;