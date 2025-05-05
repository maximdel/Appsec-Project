import { Goal } from '../../model/goal';
import { Location } from '../../model/location';
import { Match } from '../../model/match';
import { MatchTeam } from '../../model/matchTeam';
import { Team } from '../../model/team';
import { User } from '../../model/user';

const validId = 1;
const validDate = new Date('2021-01-01');

const validCountry = 'Country';
const validCity = 'City';
const validStreetName = 'Streetname';
const validZipCode = '5';
const validNumber = '1';

const negativeId = -1;
const emptyCountry = '';
const emptyCity = '';
const emptyStreetName = '';
const invalidZipCode = 0;
const invalidNumber = 0;

const validLocation = new Location({
    id: validId,
    country: 'Germany',
    city: 'Munich',
    streetName: 'Werner-Heisenberg-Allee',
    zipCode: '80939',
    number: '25',
});

const validTime = 5;
const validUser = new User({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    birthDate: new Date('2000-01-01'),
    email: 'coach@football.be',
    username: 'john_doe',
    description: 'description',
    role: 'USER',
});

const validName = 'team1';
const validCoach = validUser;
const validPlayers = [validUser];
const validDescription = 'description';

const validTeam = new Team({
    id: validId,
    name: validName,
    coach: validCoach,
    players: validPlayers,
    description: validDescription,
});

const validGoal = new Goal({
    id: validId,
    time: validTime,
    team: validTeam,
    player: validUser,
});

const validMatchTeam = new MatchTeam({ matchId: validId, team: validTeam, goals: [validGoal] });

test('given: valid values for match, when: creating a new match, then: match is created with those values', () => {
    // when
    const match = new Match({
        id: validId,
        date: validDate,
        location: validLocation,
        goals: [validGoal],
        teams: [validMatchTeam],
    });

    // then
    expect(match).toBeDefined();

    expect(match.getId()).toBe(1);
    expect(match.getDate()).toBe(validDate);
});

// test('given: no match id, when: creating a new match, then: error is thrown'), () => {
//     consts match = () => {
//         new Match({
//             date: validDate,
//             location: validLocation,
//             goals: [validGoal],
//             teams: [validMatchTeam],
//         })
//     }
//     expect(match).toThrowError()
// }

// test('given: no match date, when: creating a new match, then: error is thrown'), () => {
//     consts match = () => {
//         new Match({
//             id: validId,
//             location: validLocation,
//             goals: [validGoal],
//             teams: [validMatchTeam],
//         })
//     }
//     expect(match).toThrowError()
// }

// test('given: no match location, when: creating a new match, then: error is thrown'), () => {
//     consts match = () => {
//         new Match({
//             id: validId,
//             date: validDate,
//             goals: [validGoal],
//             teams: [validMatchTeam],
//         })
//     }
//     expect(match).toThrowError()
// }