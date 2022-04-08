import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import GameSettingsComponent from '../gameSettingsComponent';
import MockedSocket from 'socket.io-mock';

test('renders correctly', () => {
    const tree = renderer
        .create(<GameSettingsComponent socket={null} roomID={"34223"}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
