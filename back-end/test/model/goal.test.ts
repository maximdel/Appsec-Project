import { Goal } from '../../model/goal';
import { Team } from '../../model/team';
import { User } from '../../model/user';

const validTime = 5;
const validId = 1;

const invalidTime: number = -40;

const tooLowTime = -1;
const tooHighTime = 91;

const id = 1;
const firstName = 'John';
const lastName = 'Doe';
const password = 'password';
const birthDate = new Date('2000-01-01');
const email = 'john.doe@example.com';
const username = 'john_doe';
const description = 'description';
const role = 'PLAYER';

const validUser = new User({
    id: id,
    firstName: firstName,
    lastName: lastName,
    password: password,
    birthDate: birthDate,
    email: email,
    username: username,
    description: description,
    role: role,
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

test(`given: valid parameters, when: create a goal, then: goal is created`, () => {
    // given
    const goal = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    // then
    expect(goal).toBeDefined();
    expect(goal.getId()).toBe(1);
    expect(goal.getTime()).toBe(5);
});

test(`given: time under zero, when: create goal, then: error is thrown`, () => {
    expect(
        () => new Goal({ id: validId, time: tooLowTime, team: validTeam, player: validUser })
    ).toThrow('Goal time must be greater than 0');
});

test(`given: time over 90, when: create goal, then: error is thrown`, () => {
    expect(
        () => new Goal({ id: validId, time: tooHighTime, team: validTeam, player: validUser })
    ).toThrow('Goal time must be under 90');
});

test('given: none valid time, when: creating a new goal, then: error is thrown', () => {
    expect(
        () => new Goal({ id: validId, time: invalidTime, team: validTeam, player: validUser })
    ).toThrow('Goal time must be greater than 0');
});

test(`given: valid parameters, when: set new time, then: time is updated`, () => {
    const goal = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    goal.setTime(10);
    expect(goal.getTime()).toBe(10);
});

test(`given: valid parameters, when: set new team, then: team is updated`, () => {
    const goal = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    const newTeam = new Team({
        id: 2,
        name: 'team2',
        coach: validCoach,
        players: validPlayers,
        description: 'new description',
    });

    goal.setTeam(newTeam);
    expect(goal.getTeam()).toBe(newTeam);
});

test(`given: valid parameters, when: set new player, then: player is updated`, () => {
    const goal = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    const newPlayer = new User({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'newpassword',
        birthDate: new Date('1990-01-01'),
        email: 'jane.doe@example.com',
        username: 'jane_doe',
        description: 'new description',
        role: 'PLAYER',
    });

    goal.setPlayer(newPlayer);
    expect(goal.getPlayer()).toBe(newPlayer);
});

test(`given: two identical goals, when: compare them, then: they are equal`, () => {
    const goal1 = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    const goal2 = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    expect(goal1.equals(goal2)).toBe(true);
});

test(`given: two different goals, when: compare them, then: they are not equal`, () => {
    const goal1 = new Goal({
        id: validId,
        time: validTime,
        team: validTeam,
        player: validUser,
    });

    const goal2 = new Goal({
        id: 2,
        time: 10,
        team: validTeam,
        player: validUser,
    });

    expect(goal1.equals(goal2)).toBe(false);
});
