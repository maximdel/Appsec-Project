import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerGrid from '../components/playerGrid/playerGrid';

window.React = React;

const mockPlayers = [
    {
        id: 1,
        firstName: 'Lionel',
        lastName: 'Messi',
        username: 'lionelm',
        email: 'lionel.messi@example.com',
        role: 'PLAYER',
        birthDate: new Date('1987-06-24'),
        description: 'Greatest player of all time',
    },
    {
        id: 2,
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        username: 'cristianor',
        email: 'cristiano.ronaldo@example.com',
        role: 'PLAYER',
        birthDate: new Date('1985-02-05'),
        description: 'Top scorer',
    },
    {
        id: 3,
        firstName: 'Kylian',
        lastName: 'Mbappe',
        username: 'kmbappe',
        email: 'kylian.mbappe@example.com',
        role: 'PLAYER',
        birthDate: new Date('1998-12-20'),
        description: 'Young talent',
    },
];

describe('PlayerGrid Component', () => {
    it('renders the player grid with all players', () => {
        render(<PlayerGrid players={mockPlayers} />);

        // Check if players are rendered
        expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        expect(screen.getByText('Cristiano Ronaldo')).toBeInTheDocument();
        expect(screen.getByText('Kylian Mbappe')).toBeInTheDocument();
    });

    it('filters players based on search term', () => {
        render(<PlayerGrid players={mockPlayers} />);

        const searchInput = screen.getByPlaceholderText('players.searchPlaceholder');

        fireEvent.change(searchInput, { target: { value: 'Lionel' } });

        expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        expect(screen.queryByText('Cristiano Ronaldo')).not.toBeInTheDocument();
        expect(screen.queryByText('Kylian Mbappe')).not.toBeInTheDocument();
    });

    it('shows "no players found" message when no players match the search', () => {
        render(<PlayerGrid players={mockPlayers} />);

        const searchInput = screen.getByPlaceholderText('players.searchPlaceholder');

        fireEvent.change(searchInput, { target: { value: 'Neymar' } });

        expect(screen.getByText('players.noFound')).toBeInTheDocument();
        expect(screen.queryByText('Lionel Messi')).not.toBeInTheDocument();
        expect(screen.queryByText('Cristiano Ronaldo')).not.toBeInTheDocument();
        expect(screen.queryByText('Kylian Mbappe')).not.toBeInTheDocument();
    });

    it('renders no players when the players array is empty', () => {
        render(<PlayerGrid players={[]} />);

        expect(screen.getByText('players.noFound')).toBeInTheDocument();
    });
});
