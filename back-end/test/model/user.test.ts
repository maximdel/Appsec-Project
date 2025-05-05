import { User } from '../../model/user';

const id = 1;
const firstName = 'John';
const lastName = 'Doe';
const password = 'password';
const birthDate = new Date('2000-01-01');
const email = 'john.doe@example.com';
const username = 'john_doe';
const description = 'description';
const role = 'USER';

test('given: valid values for user, when: creating a new user, then: user is created with those values', () => {
    // when
    const user = new User({
        id: id,
        firstName: firstName,
        lastName: lastName,
        password: password,
        birthDate: birthDate,
        email: email,
        username: username,
        description: description,
        role: 'USER',
    });

    // then
    expect(user.getId()).toBe(id);
    expect(user.getFirstName()).toBe(firstName);
    expect(user.getLastName()).toBe(lastName);
    expect(user.getPassword()).toBe(password);
    expect(user.getBirthDate()).toBe(birthDate);
    expect(user.getEmail()).toBe(email);
    expect(user.getUsername()).toBe(username);
    expect(user.getDescription()).toBe(description);
    expect(user.getRole()).toBe(role);
});

test('given: empty first name, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: '',
            lastName: 'Doe',
            password: 'password',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('First name cannot be empty.');
});

// test('given: no first name, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             lastName: 'Doe',
//             password: 'password',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: 'USER',
//         });
//     expect(user).toThrowError('First name cannot be empty.');
// });

test('given: empty last name, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: '',
            password: 'password',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Last name cannot be empty.');
});

// test('given: no last name, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             password: 'password',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: 'USER',
//         });
//     expect(user).toThrowError('Last name cannot be empty.');
// });

test('given: empty password, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: '',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Password needs to be at least 8 characters long.');
});

test('given: short password, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'short',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Password needs to be at least 8 characters long.');
});

// test('given: no password, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: 'PLAYER',
//         });
//     expect(user).toThrow('Password needs to be at least 8 characters long.');
// });
test('given: birth date in future, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            birthDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Birth date must be in the past.');
});

// test('given: no birth date, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             password: 'password',
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: 'PLAYER',
//         });
//     expect(user).toThrow('Birth date must be in the past.');
// });

test('given: empty email, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            birthDate: birthDate,
            email: '',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Email cannot be empty.');
});

test('given: invalid email format, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            birthDate: birthDate,
            email: 'john.doe@com',
            username: 'john_doe',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Email does not have a correct format.');
});

// test('given: no email, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             password: 'password',
//             birthDate: birthDate,
//             username: 'john_doe',
//             description: 'description',
//             role: 'PLAYER',
//         });
//     expect(user).toThrow('Email does not have a correct format.');
// });

test('given: empty username, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: '',
            description: 'description',
            role: 'PLAYER',
        });
    }).toThrow('Username cannot be empty.');
});

// test('given: no username, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             password: 'password',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             description: 'description',
//             role: 'USER',
//         });
//     expect(user).toThrowError('Username cannot be empty.');
// });

test('given: empty description, when: creating a new user, then: throws error', () => {
    expect(() => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            birthDate: birthDate,
            email: 'john.doe@example.com',
            username: 'john_doe',
            description: '   ',
            role: 'PLAYER',
        });
    }).toThrow('Description cannot be empty if provided.');
});

// test('given: empty role, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             password: 'password',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: '',
//         });
//     expect(user).toThrowError("Role can't be empty.");
// });

// test('given: wrong role, when: creating a new user, then: throws error', () => {
//     const user = () =>
//         new User({
//             id: 1,
//             firstName: 'John',
//             lastName: 'Doe',
//             password: 'password',
//             birthDate: birthDate,
//             email: 'john.doe@example.com',
//             username: 'john_doe',
//             description: 'description',
//             role: 'Tester',
//         });
//     expect(user).toThrowError(
//         `Invalid role. Role must be one of the following: ${roles.join(', ')}.`
//     );
// });
