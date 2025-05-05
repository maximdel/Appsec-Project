import { Team } from '../../model/team';
import { User } from '../../model/user';
import teamDb from '../../repository/team.db';
import userDb from '../../repository/user.db';
import teamService from '../../service/team.service';

jest.mock('../../repository/team.db');
jest.mock('../../repository/user.db');

describe('TeamService Tests', () => {
    let mockGetAllTeams: jest.Mock;
    let mockGetTeamsByName: jest.Mock;
    let mockGetTeamById: jest.Mock;
    let mockUpdateTeam: jest.Mock;
    let mockGetUserById: jest.Mock;

    const validTeam = new Team({
        id: 1,
        name: 'Team A',
        description: 'The best football team',
        players: [],
    });

    const validUser = new User({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashedpassword',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        username: 'johndoe',
        role: 'PLAYER',
    });

    beforeEach(() => {
        mockGetAllTeams = jest.fn();
        mockGetTeamsByName = jest.fn();
        mockGetTeamById = jest.fn();
        mockUpdateTeam = jest.fn();
        mockGetUserById = jest.fn();

        teamDb.getAllTeams = mockGetAllTeams;
        teamDb.getTeamsByName = mockGetTeamsByName;
        teamDb.getTeamById = mockGetTeamById;
        teamDb.updateTeam = mockUpdateTeam;
        userDb.getUserById = mockGetUserById;

        jest.clearAllMocks();
    });

    describe('getAllTeams', () => {
        it('should return all teams', async () => {
            // given
            mockGetAllTeams.mockResolvedValue([validTeam]);

            // when
            const teams = await teamService.getAllTeams();

            // then
            expect(mockGetAllTeams).toHaveBeenCalledTimes(1);
            expect(teams).toEqual([validTeam]);
        });

        it('should return an empty array if no teams are found', async () => {
            // given
            mockGetAllTeams.mockResolvedValue([]);

            // when
            const teams = await teamService.getAllTeams();

            // then
            expect(mockGetAllTeams).toHaveBeenCalledTimes(1);
            expect(teams).toEqual([]);
        });
    });

    describe('getTeamById', () => {
        it('should return the team for a valid ID', async () => {
            // given
            mockGetTeamById.mockResolvedValue(validTeam);

            // when
            const team = await teamService.getTeamById(1);

            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(1);
            expect(team).toEqual(validTeam);
        });

        it('should throw an error if team ID is invalid', async () => {
            // when / then
            await expect(teamService.getTeamById('invalid')).rejects.toThrow(
                'Invalid Team ID. It must be a number.'
            );
        });

        it('should throw an error if team is not found', async () => {
            // given
            mockGetTeamById.mockResolvedValue(null);

            // when / then
            await expect(teamService.getTeamById(1)).rejects.toThrow('Team with ID 1 not found.');
        });
    });

    describe('updateTeam', () => {
        it('should update the team if valid data is provided', async () => {
            // given
            const validTeamInput = {
                id: 1,
                name: 'Updated Team Name',
                description: 'Updated description',
                coachId: 1,
                players: [],
            };
    
            const expectedTeam = new Team({
                id: 1,
                name: 'Updated Team Name',
                description: 'Updated description',
                coach: undefined,
                players: [],
            });
    
            mockGetTeamById.mockResolvedValue(expectedTeam);
            mockUpdateTeam.mockResolvedValue(expectedTeam);
    
            // when
            const result = await teamService.updateTeam(validTeamInput);
    
            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(validTeamInput.id);
            expect(mockUpdateTeam).toHaveBeenCalledWith(expect.objectContaining({
                id: 1,
                name: 'Updated Team Name',
                description: 'Updated description',
                players: [],
            }));
            expect(result).toEqual(expectedTeam);
        });
    
        it('should throw an error if the team is not found', async () => {
            // given
            const validTeamInput = {
                id: 1,
                name: 'Nonexistent Team',
                description: 'Description',
                coachId: 1,
                players: [],
            };
    
            mockGetTeamById.mockResolvedValue(null);
    
            // when / then
            await expect(teamService.updateTeam(validTeamInput)).rejects.toThrow('Team not found');
        });
    });
    

    describe('addPlayerToTeam', () => {
        it('should add a player to a team', async () => {
            // given
            mockGetTeamById.mockResolvedValue(validTeam);
            mockGetUserById.mockResolvedValue(validUser);
            mockUpdateTeam.mockResolvedValue(validTeam);

            // when
            const result = await teamService.addPlayerToTeam(1, 1);

            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(1);
            expect(mockGetUserById).toHaveBeenCalledWith(1);
            expect(result).toEqual(true);
        });

        it('should return false if the team is not found', async () => {
            // given
            mockGetTeamById.mockResolvedValue(null);

            // when
            const result = await teamService.addPlayerToTeam(1, 1);

            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(1);
            expect(result).toEqual(false);
        });

        it('should return false if the player is not found', async () => {
            // given
            mockGetTeamById.mockResolvedValue(validTeam);
            mockGetUserById.mockResolvedValue(null);

            // when
            const result = await teamService.addPlayerToTeam(1, 1);

            // then
            expect(mockGetUserById).toHaveBeenCalledWith(1);
            expect(result).toEqual(false);
        });
    });

    describe('removePlayerFromTeam', () => {
        it('should remove a player from a team', async () => {
            // given
            mockGetTeamById.mockResolvedValue(validTeam);
            mockGetUserById.mockResolvedValue(validUser);
            mockUpdateTeam.mockResolvedValue(validTeam);

            // when
            const result = await teamService.removePlayerFromTeam(1, 1);

            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(1);
            expect(mockGetUserById).toHaveBeenCalledWith(1);
            expect(result).toEqual(validTeam);
        });

        it('should return false if the team is not found', async () => {
            // given
            mockGetTeamById.mockResolvedValue(null);

            // when
            const result = await teamService.removePlayerFromTeam(1, 1);

            // then
            expect(mockGetTeamById).toHaveBeenCalledWith(1);
            expect(result).toEqual(false);
        });

        it('should return false if the player is not found', async () => {
            // given
            mockGetTeamById.mockResolvedValue(validTeam);
            mockGetUserById.mockResolvedValue(null);

            // when
            const result = await teamService.removePlayerFromTeam(1, 1);

            // then
            expect(mockGetUserById).toHaveBeenCalledWith(1);
            expect(result).toEqual(false);
        });
    });
});
