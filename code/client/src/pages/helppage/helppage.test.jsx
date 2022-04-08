import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import HelpPage from './helppage';
import MockedSocket from 'socket.io-mock';

test('renders correctly', () => {
    const tree = renderer
        .create(<HelpPage/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
