import { User } from '@types';

const getAllPlayers = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/players', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getAllUsers = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const updateUser = async (user: User) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const getUserByUsername = async (username: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getUsersByRole = async (role: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/role/${role}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const logoutUser = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
    });
};

const getCurrentUser = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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

const removeUser = (username: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/users/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export function forgotPassword(username: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
}

export function resetPassword(token: string, newPassword: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });
}

const UserService = {
    getAllPlayers,
    getAllUsers,
    getUserByUsername,
    getUsersByRole,
    updateUser,
    loginUser,
    registerUser,
    removeUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    getCurrentUser,
};

export default UserService;
