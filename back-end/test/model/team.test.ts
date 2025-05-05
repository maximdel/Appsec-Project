import { Team } from '../../model/team';
import { User } from '../../model/user';

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

const validId = 1;
const validName = 'team1';
const validCaptain = validUser;
const validCoach = validUser;
const validPlayers = [validUser];
const validDescription = 'description';

const emptyName = '';
const negativeId = -1;
const nullCaptain = null;
const nullCoach = null;
const nullPlayers = null;
const emptyDescription = '';

test(`given: valid parameters, when: create a team, then: team should be created`, () => {
    // When
    const team = new Team({
        id: validId,
        name: validName,
        coach: validCoach,
        players: validPlayers,
        description: validDescription,
    });

    // Then
    expect(team).toBeDefined();
    expect(team.getId()).toBe(1);
    expect(team.getName()).toBe('team1');
    expect(team.getCoach()).toBe(validUser);
    expect(team.getPlayers()).toBe(validPlayers);
    expect(team.getDescription()).toBe('description');
});

// test(`given: negative id, when: create team, then: error is thrown`, () => {
//     expect(
//         () =>
//             new Team({
//                 id: negativeId,
//                 name: validName,
//                 coach: validCoach,
//                 players: validPlayers,
//                 description: validDescription,
//             })
//     ).toThrow('Id cannot be negative');
// });

test(`given: empty name, when: create team, then: error is thrown`, () => {
    expect(
        () =>
            new Team({
                id: validId,
                name: emptyName,
                coach: validCoach,
                players: validPlayers,
                description: validDescription,
            })
    ).toThrow('Invalid name');
});


// test('given: no coach, when: creating a new team, then: throws error', () => {
//     const team = () =>
//         new Team({
//             id: validId,
//             name: validName,
//             players: validPlayers,
//             description: validDescription,
//         });
//     expect(user).toThrowError('Invalid coach');
// });





test(`given: empty description, when: create team, then: error is thrown`, () => {
    expect(
        () =>
            new Team({
                id: validId,
                name: validName,
                coach: validCoach,
                players: validPlayers,
                description: emptyDescription,
            })
    ).toThrow('Invalid description');
});

