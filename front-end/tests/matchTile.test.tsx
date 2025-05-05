import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import router from 'next/router';
import React from 'react';
import MatchTile from '../components/match/matchTile';
window.React = React;

jest.mock('next/router', () => ({
    push: jest.fn(),
}));

const mockPlayer = {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    username: 'lionelm',
    email: 'lionel.messi@example.com',
    role: 'PLAYER',
    birthDate: new Date('1987-06-24'),
    description: 'Greatest player of all time',
};
const mockTeam1 = {
    id: 1,
    name: 'Team A',
    captain: mockPlayer,
    coach: mockPlayer,
    players: [mockPlayer],
    description: 'Description',
};
const mockTeam2 = {
    id: 2,
    name: 'Team B',
    captain: mockPlayer,
    coach: mockPlayer,
    players: [mockPlayer],
    description: 'Description',
};

const mockMatch = {
    id: 1,
    date: new Date('2024-12-20'),
    teams: [
        {
            team: mockTeam1,
            goals: [{ id: 1, time: 10, player: mockPlayer, team: mockTeam1 }],
            date: new Date(),
            location: {
                id: 0,
                country: '',
                city: '',
                streetName: '',
                zipCode: 0,
                number: 0,
            },
        },
        {
            team: mockTeam2,
            goals: [],
            date: new Date(),
            location: {
                id: 0,
                country: '',
                city: '',
                streetName: '',
                zipCode: 0,
                number: 0,
            },
        },
    ],
    location: {
        id: 0,
        country: '',
        city: '',
        streetName: '',
        zipCode: 0,
        number: 0,
    },
    goals: [],
};

describe('MatchTile Component', () => {
    it('renders match details correctly', () => {
        render(<MatchTile match={mockMatch} teamId={1} />);

        // Check team names
        expect(screen.getByText('Team A')).toBeInTheDocument();
        expect(screen.getByText('Team B')).toBeInTheDocument();

        // Check scores
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();

        // Check match date
        expect(screen.getByText('12/20/2024')).toBeInTheDocument();
    });

    it('applies the correct color classes based on scores', () => {
        render(<MatchTile match={mockMatch} teamId={1} />);

        // Team A has a goal, so it should have a green score
        const team1Score = screen.getByText('1');
        expect(team1Score).toHaveClass('text-green-500');

        // Team B has no goals, so it should have a red score
        const team2Score = screen.getByText('0');
        expect(team2Score).toHaveClass('text-red-500');
    });

    it('navigates to match detail page when clicked', () => {
        render(<MatchTile match={mockMatch} teamId={1} />);

        // Simulate click
        const matchTile = screen.getByText('Team A').closest('div');
        fireEvent.click(matchTile!);

        // Assert router navigation
        expect(router.push).toHaveBeenCalledWith('/matches/1');
    });
});
