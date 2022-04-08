
import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import PlayerInfoComponent from '../playerInfoComponent';

test('renders correctly', () => {
    const tree = renderer
        .create(<PlayerInfoComponent socket={null} roomID={"34223"}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
