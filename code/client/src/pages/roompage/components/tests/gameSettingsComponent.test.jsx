import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameSettingsComponent from '../gameSettingsComponent';
import SocketMock  from 'socket.io-mock';
import { toMatchDiffSnapshot } from 'snapshot-diff';
const {act} = renderer;


expect.extend({ toMatchDiffSnapshot });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("GameSettingsComponent", () => {
    let socket;
    let container;

    beforeEach(() => {
        socket = new SocketMock();
            socket.on("getConnectedClients", (roomId) => {
            console.log("testasdfsf");
        })
    });



    
    test('renders correctly', async () => {
            let component;
            act(() => {
                component = renderer.create(<GameSettingsComponent socket={socket.socketClient} roomID={"34223"} />);
            });
            
            await sleep(2000);
            let tree = component.toJSON();
            expect(tree).toMatchSnapshot();
    });

     test("should send 'changeGameSpeed' to socket when the slider is moved", (done) => {
         socket.on("changeGameSpeed",  (roomId, newSpeed) =>{
            expect(newSpeed).toEqual("10");
            done()
         });

        render(<GameSettingsComponent socket={socket.socketClient} roomID={"34223"} />);
        const slider = document.querySelector('[data-testid="speed_input"]');
        fireEvent.change(slider, { target: { value: 10 } });
     })

    test("should send 'changeClientName' to socket when the nickname is changed", (done) => {
         socket.on("changeClientName",  (roomId, clientId, newName) =>{
            expect(newName).toEqual("Lorem");
            done()
         });

        render(<GameSettingsComponent socket={socket.socketClient} roomID={"34223"} />);
        
        userEvent.paste(screen.getByTestId("nickname_input"), "Lorem");
     })

    test("should send 'changeClientColor' to socket when the color is changed", async () => {
         socket.on("changeGameSpeed",  (roomId, clientID, newColor) =>{
            expect(newColor).toEqual("#0000ff");
            done()
         });

        render(<GameSettingsComponent socket={socket.socketClient} roomID={"34223"} />);
        const colorSelector = document.querySelector('[data-testid="color_input"]');
        fireEvent.change(colorSelector, { target: { value: "#0000ff" } });
     })

})

