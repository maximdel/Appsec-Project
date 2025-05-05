import { User } from '@types';

const getAllPlayers = async () => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/players', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getAllUsers = async () => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateUser = async (user: User) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(user),
    });
};

const getUserByUsername = async (username: string) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getUsersByRole = async (role: string) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/role/${role}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const registerUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const UserService = {
    getAllPlayers,
    getAllUsers,
    getUserByUsername,
    getUsersByRole,
    updateUser,
    loginUser,
    registerUser,
};

export default UserService;
