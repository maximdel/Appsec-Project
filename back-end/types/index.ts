import { User } from '../model/user';

type Role = 'USER' | 'PLAYER' | 'COACH' | 'ADMIN';

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    password: string;
    birthDate: Date;
    email: string;
    username: string;
    description?: string;
    role: string;
    coachOfTeam?: TeamInput;
    playerOfTeam?: TeamInput;
    goals?: GoalInput[];
};

type TeamInput = {
    id?: number;
    name: string;
    description: string;
    coachId: number;
    players: User[];
};

type GoalInput = {
    id?: number;
    matchId: number;
    playerId: number;
    time: Date;
    description: string;
};

type MatchInput = {
    id?: number;
    date: Date;
    location: number;
    teams: { teamId: number }[];
    goals: number[];
};

type LocationInput = {
    id?: number;
    name: string;
    city: string;
    country: string;
};

type AuthenticationRequest = {
    email: string;
    password: string;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: string;
    teamId?: number;
};
export type {
    AuthenticationRequest,
    AuthenticationResponse,
    GoalInput,
    LocationInput,
    MatchInput,
    Role,
    TeamInput,
    UserInput,
};
