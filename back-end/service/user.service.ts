import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { UnauthorizedError } from 'express-jwt';
import { User } from '../model/user';
import teamDb from '../repository/team.db';
import userDb from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';
import { sendMail } from '../util/mailer';

// Fetch all players and strip passwords
const getAllPlayers = async (): Promise<any[]> => {
    const players = await userDb.getAllPlayers();
    if (!players) throw new Error('No players found.');
    return players.map((u) => u.toPublic());
};

// Fetch all users (admin only) and strip passwords
const getAllUsers = async ({ role }: { role: string }): Promise<any[]> => {
    if (role !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource',
        });
    }
    const users = await userDb.getAllUsers();
    return users.map((u) => u.toPublic());
};

// Update user and return public view
const updateUser = async (userId: number, editedUser: UserInput): Promise<any | null> => {
    const user = await userDb.getUserById(userId);
    if (!user) return null;

    const { playerOfTeam, description, email, password, firstName, lastName, birthDate } =
        editedUser;

    if (playerOfTeam?.id != null && playerOfTeam.id !== user.getPlayerOfTeam()?.getId()) {
        const team = await teamDb.getTeamById(playerOfTeam.id);
        if (!team) throw new Error('Team does not exist');
        user.setPlayerOfTeam(team);
    }

    if (description != null && user.getDescription() !== description) {
        user.setDescription(description);
    }

    if (email != null && user.getEmail() !== email) {
        const existingEmail = await userDb.getUserByEmail(email);
        if (existingEmail) throw new Error('Email already exists');
        user.setEmail(email);
    }

    if (password != null && user.getPassword() !== password) {
        await user.setPassword(password);
    }

    const updatedModel = new User({
        id: userId,
        username: user.getUsername(),
        password: user.getPassword(),
        firstName: firstName ?? user.getFirstName(),
        lastName: lastName ?? user.getLastName(),
        email: email ?? user.getEmail(),
        birthDate: birthDate ?? user.getBirthDate(),
        role: user.getRole(),
        playerOfTeam: user.getPlayerOfTeam(),
        description: description ?? user.getDescription(),
    });

    const saved = await userDb.updateUser(updatedModel);
    return saved.toPublic();
};

// Fetch by ID and strip password
const getUserById = async (userId: number): Promise<any> => {
    const user = await userDb.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} does not exist.`);
    return user.toPublic();
};

// Fetch by username and strip password
const getUserByUsername = async ({ username }: { username: string }): Promise<any> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) throw new Error(`User with username: ${username} does not exist.`);
    return user.toPublic();
};

// Users by role (no password)
const getUsersByRole = async (role: Role): Promise<any[]> => {
    const users = await userDb.getUsersByRole(role);
    if (!users) throw new Error('No users found.');
    return users.map((u) => u.toPublic());
};

// Authentication response remains unchanged—but uses raw user for check
const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    // for JSON response we need the public user details
    const publicUser = await getUserByUsername({ username });
    // for password check we need the hashed pw
    const rawUser = await userDb.getUserByUsername({ username })!;
    if (!rawUser) throw new Error('User not found.');

    const isValid = await bcrypt.compare(password, rawUser.getPassword());
    if (!isValid) throw new Error('Incorrect password.');

    const teamId = rawUser.getCoachOfTeam()?.getId() ?? rawUser.getPlayerOfTeam()?.getId();

    return {
        token: generateJwtToken({ username, role: rawUser.getRole() }),
        username,
        fullname: `${rawUser.getFirstName()} ${rawUser.getLastName()}`,
        role: rawUser.getRole(),
        ...(teamId !== undefined && { teamId }),
    };
};

// Create user and return public view
const createUser = async ({
    username,
    password,
    firstName,
    lastName,
    email,
    birthDate,
}: UserInput): Promise<any> => {
    const exists = await userDb.getUserByUsername({ username });
    if (exists) throw new Error(`User with username ${username} is already registered.`);

    const hashed = await bcrypt.hash(password, 12);
    const model = new User({ username, password: hashed, firstName, lastName, email, birthDate });
    const newUser = await userDb.createUser(model);
    return newUser.toPublic();
};

const removeUser = async ({ username }: { username: string }): Promise<string> => {
    const exists = await userDb.getUserByUsername({ username });
    if (!exists) throw new Error(`User with username ${username} does not exist.`);
    return userDb.removeUser(username);
};

// Forgot-password kick-off (returns only a message)
export async function forgotPassword({ username }: { username: string }): Promise<string> {
    const user = await getUserByUsername({ username });

    const token = randomBytes(32).toString('hex');
    const expires = addHours(new Date(), 1);
    await userDb.storeResetToken(username, token, expires);

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendMail({
        to: user.username,
        subject: 'Password reset request',
        text: `Hi ${user.firstName},\nClick here: ${url}\nExpires in 1 hour.`,
    });

    return 'If that username is registered, you will receive a reset link shortly.';
}

// Reset-password finalization
export async function resetPassword({
    token,
    newPassword,
}: {
    token: string;
    newPassword: string;
}): Promise<string> {
    const rec = await userDb.findByResetToken(token);
    if (!rec || rec.resetTokenExpires.getTime() < Date.now()) {
        throw new Error('Invalid or expired reset token.');
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await userDb.updatePassword(rec.username, hashed);
    await userDb.clearResetToken(rec.username);
    return 'Password has been reset successfully.';
}

export default {
    getAllPlayers,
    getAllUsers,
    updateUser,
    getUserById,
    getUserByUsername,
    getUsersByRole,
    authenticate,
    createUser,
    removeUser,
    forgotPassword,
    resetPassword,
};
