import bcrypt from 'bcrypt';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { generateJwtToken } from '../../util/jwt';

// const teamA: Team = {
//     id: 1,
//     name: 'Team A',
//     description: 'The best football team',
//     coach: undefined,
//     players: [],
// };

// const teamB: Team = {
//     id: 2,
//     name: 'Team B',
//     description: 'A competitive football team',
//     coach: undefined,
//     players: [],
//     matches: [],
//     goals: [],
// };

// const goal1: Goal = {
//     id: 1,
//     time: 15,
//     match: undefined,
//     team: teamA,
//     matchId: 1,
//     teamId: 1,
//     player: undefined,
//     playerId: 1,
// };

// const goal2: Goal = {
//     id: 2,
//     time: 30,
//     match: undefined,
//     team: teamB,
//     matchId: 1,
//     teamId: 2,
//     player: undefined,
//     playerId: 2,
// };

const validUsers: User[] = [
    new User({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        username: 'johndoe',
        description: 'An enthusiastic football player.',
        role: 'PLAYER',
        coachOfTeam: undefined,
    }),
    new User({
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'securepassword',
        birthDate: new Date('1988-05-15'),
        email: 'jane.smith@example.com',
        username: 'janesmith',
        description: 'An experienced football coach.',
        role: 'COACH',
        playerOfTeam: undefined,
        goals: [],
    }),
    new User({
        id: 3,
        firstName: 'Alice',
        lastName: 'Johnson',
        password: 'password456',
        birthDate: new Date('2000-09-12'),
        email: 'alice.johnson@example.com',
        username: 'alicejohnson',
        description: 'A young and talented football player.',
        role: 'COACH',
        coachOfTeam: undefined,
    }),
    new User({
        id: 4,
        firstName: 'Bob',
        lastName: 'Williams',
        password: 'mypassword789',
        birthDate: new Date('1995-11-20'),
        email: 'bob.williams@example.com',
        username: 'bobwilliams',
        description: 'A versatile player.',
        role: 'ADMIN',
        coachOfTeam: undefined,
        goals: [],
    }),
];
jest.mock('../../util/jwt', () => ({
    generateJwtToken: jest.fn(),
}));

describe('UserService Tests', () => {
    let mockGetAllPlayers: jest.Mock;
    let mockGetAllUsers: jest.Mock;
    let mockGetUserById: jest.Mock;
    let mockGetUserByUsername: jest.Mock;
    let mockGetUsersByRole: jest.Mock;
    let mockUpdateUser: jest.Mock;
    let mockCompare: jest.Mock;
    let mockGenerateJwtToken: jest.Mock;

    beforeEach(() => {
        mockGetAllPlayers = jest.fn();
        mockGetAllUsers = jest.fn();
        mockGetUserById = jest.fn();
        mockGetUserByUsername = jest.fn();
        mockGetUsersByRole = jest.fn();
        mockUpdateUser = jest.fn();
        mockCompare = jest.fn();
        mockGenerateJwtToken = jest.fn();

        userDb.getAllPlayers = mockGetAllPlayers;
        userDb.getAllUsers = mockGetAllUsers;
        userDb.getUserById = mockGetUserById;
        userDb.getUserByUsername = mockGetUserByUsername;
        userDb.getUsersByRole = mockGetUsersByRole;
        userDb.updateUser = mockUpdateUser;
        bcrypt.compare = mockCompare;

        jest.clearAllMocks();
    });

    describe('getAllPlayers', () => {
        it('should return a list of players', async () => {
            // given
            const mockPlayers = [validUsers[0], validUsers[1]];
            mockGetAllPlayers.mockResolvedValue(mockPlayers);

            // when
            const players = await userService.getAllPlayers();

            // then
            expect(mockGetAllPlayers).toHaveBeenCalledTimes(1);
            expect(players).toEqual(mockPlayers);
        });

        it('should return an empty array if no players found', async () => {
            // given
            mockGetAllPlayers.mockResolvedValue([]);

            // when
            const players = await userService.getAllPlayers();

            // then
            expect(mockGetAllPlayers).toHaveBeenCalledTimes(1);
            expect(players).toEqual([]);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users if role is ADMIN', async () => {
            // given
            const mockUsers = [validUsers[0], validUsers[2]];
            mockGetAllUsers.mockResolvedValue(mockUsers);

            // when
            const users = await userService.getAllUsers({ role: 'ADMIN' });

            // then
            expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
            expect(users).toEqual(mockUsers);
        });

        it('should throw an UnauthorizedError if role is not ADMIN', async () => {
            // when / then
            await expect(userService.getAllUsers({ role: 'PLAYER' })).rejects.toThrow(
                'You are not authorized to access this resource'
            );
        });
    });

    describe('getUserById', () => {
        it('should return the user for a valid ID', async () => {
            // given
            const mockUser = validUsers[0];
            mockGetUserById.mockResolvedValue(mockUser);

            // when
            const user = await userService.getUserById(1);

            // then
            expect(mockGetUserById).toHaveBeenCalledWith(1);
            expect(user).toEqual(mockUser);
        });

        it('should throw an error if user does not exist', async () => {
            // given
            mockGetUserById.mockResolvedValue(null);

            // when / then
            await expect(userService.getUserById(1)).rejects.toThrow(
                'User with username: 1 does not exist.'
            );
        });
    });

    describe('authenticate', () => {
        it('should return authentication response for valid credentials', async () => {
            // given
            const mockUser = new User({
                id: 5,
                firstName: 'New',
                lastName: 'User',
                password: 'hashedpassword',
                birthDate: new Date('2000-09-12'),
                email: 'test.user@example.com',
                username: 'testing',
                description: 'A testing user.',
                role: 'USER',
            });
            const mockToken = 'mockToken';

            mockGetUserByUsername.mockResolvedValue(mockUser);
            mockCompare.mockImplementation((plainTextPassword, hashedPassword) => {
                return plainTextPassword === 'rightpassword' && hashedPassword === 'hashedpassword';
            });
            (generateJwtToken as jest.Mock).mockReturnValue(mockToken);

            const input = {
                firstName: 'New',
                lastName: 'User',
                password: 'rightpassword',
                birthDate: new Date('2000-09-12'),
                email: 'test.user@example.com',
                username: 'testing',
                description: 'A testing user.',
                role: 'USER',
            };

            // when
            const response = await userService.authenticate(input);

            // then
            expect(mockGetUserByUsername).toHaveBeenCalledWith({ username: 'testing' });
            expect(mockCompare).toHaveBeenCalledWith('rightpassword', 'hashedpassword');
            expect(generateJwtToken).toHaveBeenCalledWith({
                username: 'testing',
                role: 'USER',
            });
            expect(response).toEqual({
                token: mockToken,
                username: 'testing',
                fullname: 'New User',
                role: 'USER',
            });
        });

        it('should throw an error for invalid password', async () => {
            // given
            const mockUser = new User({
                id: 5,
                firstName: 'New',
                lastName: 'User',
                password: 'hashedpassword',
                birthDate: new Date('2000-09-12'),
                email: 'test.user@example.com',
                username: 'testing',
                description: 'A testing user.',
                role: 'USER',
            });

            mockGetUserByUsername.mockResolvedValue(mockUser);
            mockCompare.mockResolvedValue(false);

            const input = {
                firstName: 'New',
                lastName: 'User',
                password: 'wrongpassword',
                birthDate: new Date('2000-09-12'),
                email: 'test.user@example.com',
                username: 'testing',
                description: 'A testing user.',
                role: 'USER',
            };

            // when / then
            await expect(userService.authenticate(input)).rejects.toThrow('Incorrect password.');
        });
    });
});
