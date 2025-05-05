import { Location } from '../../model/location';
import { Match } from '../../model/match';
import matchDb from '../../repository/match.db';
import matchService from '../../service/match.service';

jest.mock('../../repository/match.db');
const validLocation1 = new Location({
    id: 1,
    country: 'Belgium',
    city: 'Brussels',
    streetName: 'Rue de la Loi',
    zipCode: '1000',
    number: '16',
});

const validLocation2 = new Location({
    id: 2,
    country: 'France',
    city: 'Paris',
    streetName: 'Champs-Élysées',
    zipCode: '75008',
    number: '101',
});

const validMatch = new Match({
    id: 1,
    date: new Date('2024-12-01T15:00:00.000Z'),
    location: validLocation1,
    teams: [],
    goals: [],
});

const validMatch2 = new Match({
    id: 2,
    date: new Date('2024-12-02T18:00:00.000Z'),
    location: validLocation2,
    teams: [],
    goals: [],
});
describe('MatchService Tests', () => {
    let mockGetAllMatches: jest.Mock;
    let mockGetMatchById: jest.Mock;
    let mockGetLatestMatches: jest.Mock;

    beforeEach(() => {
        mockGetAllMatches = jest.fn();
        mockGetMatchById = jest.fn();
        mockGetLatestMatches = jest.fn();

        matchDb.getAllMatches = mockGetAllMatches;
        matchDb.getMatchById = mockGetMatchById;
        matchDb.getLatestMatches = mockGetLatestMatches;

        jest.clearAllMocks();
    });

    describe('getAllMatches', () => {
        it('should return all matches', async () => {
            // given
            mockGetAllMatches.mockResolvedValue([validMatch, validMatch2]);

            // when
            const matches = await matchService.getAllMatches();

            // then
            expect(mockGetAllMatches).toHaveBeenCalledTimes(1);
            expect(matches).toEqual([validMatch, validMatch2]);
        });

        it('should return an empty array if no matches are found', async () => {
            // given
            mockGetAllMatches.mockResolvedValue([]);

            // when
            const matches = await matchService.getAllMatches();

            // then
            expect(mockGetAllMatches).toHaveBeenCalledTimes(1);
            expect(matches).toEqual([]);
        });
    });

    describe('getMatchById', () => {
        it('should return the match for a valid ID', async () => {
            // given
            mockGetMatchById.mockResolvedValue(validMatch);

            // when
            const match = await matchService.getMatchById('1');

            // then
            expect(mockGetMatchById).toHaveBeenCalledWith(1);
            expect(match).toEqual(validMatch);
        });

        it('should throw an error if match ID is invalid', async () => {
            // when / then
            await expect(matchService.getMatchById('invalid')).rejects.toThrow(
                'Match with id: invalid does not exist.'
            );
        });

        it('should throw an error if match is not found', async () => {
            // given
            mockGetMatchById.mockResolvedValue(null);

            // when / then
            await expect(matchService.getMatchById('1')).rejects.toThrow(
                'Match with id: 1 does not exist.'
            );
        });
    });
    describe('getLatestMatches', () => {
        let mockGetLatestMatches: jest.Mock;

        beforeEach(() => {
            mockGetLatestMatches = jest.fn();
            matchDb.getLatestMatches = mockGetLatestMatches;
            jest.clearAllMocks();
        });

        it('should throw an error if limit is not a positive number', async () => {
            await expect(matchService.getLatestMatches({ teamId: 1, limit: 0 })).rejects.toThrow(
                'Limit must be a positive number'
            );
        });

        it('should fetch matches with default limit if limit is not provided', async () => {
            // given
            const mockMatches = [{ id: 1, date: new Date(), location: {}, teams: [], goals: [] }];
            mockGetLatestMatches.mockResolvedValue(mockMatches);

            // when
            const matches = await matchService.getLatestMatches({ teamId: 1 });

            // then
            expect(mockGetLatestMatches).toHaveBeenCalledWith({ teamId: 1, limit: 5 });
            expect(matches).toEqual(mockMatches);
        });

        it('should fetch matches with specified limit', async () => {
            // given
            const mockMatches = [{ id: 1, date: new Date(), location: {}, teams: [], goals: [] }];
            mockGetLatestMatches.mockResolvedValue(mockMatches);

            // when
            const matches = await matchService.getLatestMatches({ teamId: 1, limit: 10 });

            // then
            expect(mockGetLatestMatches).toHaveBeenCalledWith({ teamId: 1, limit: 10 });
            expect(matches).toEqual(mockMatches);
        });

        it('should throw a generic error if the database query fails', async () => {
            // given
            mockGetLatestMatches.mockRejectedValue(new Error('Database connection failed'));

            // when / then
            await expect(matchService.getLatestMatches({ teamId: 1, limit: 5 })).rejects.toThrow(
                'Failed to fetch latest matches.'
            );
            expect(mockGetLatestMatches).toHaveBeenCalledTimes(1);
        });
    });
});
