import { Role } from '@prisma/client';
import { User } from '../model/user';
import database from './database';

const getAllPlayers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            where: {
                role: 'PLAYER',
            },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: {
                playerOfTeam: true,
                coachOfTeam: true,
                goals: {
                    include: {
                        team: true,
                        player: true,
                    },
                },
            },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                email: email,
            },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getUsersByRole = async (role: Role): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            where: {
                role,
            },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const updateUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            where: {
                id: user.getId(),
            },
            data: {
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                password: user.getPassword(),
                birthDate: user.getBirthDate(),
                email: user.getEmail(),
                username: user.getUsername(),
                description: user.getDescription() ?? '',
                role: user.getRole(),
                playerOfTeam: user.getPlayerOfTeam()
                    ? { connect: { id: user.getPlayerOfTeam()?.getId() } }
                    : undefined,
                coachOfTeam: user.getCoachOfTeam()
                    ? { connect: { id: user.getCoachOfTeam()?.getId() } }
                    : undefined,
            },
            include: {
                playerOfTeam: {
                    include: {
                        coach: true,
                        players: true,
                    },
                },
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
            include: {
                playerOfTeam: true,
                coachOfTeam: true,
                goals: {
                    include: {
                        team: true,
                        player: true,
                    },
                },
            },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                password: user.getPassword(),
                birthDate: user.getBirthDate(),
                email: user.getEmail(),
                username: user.getUsername(),
                description: user.getDescription(),
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const removeUser = async (username: string): Promise<string> => {
    try {
        await database.user.delete({
            where: { username: username },
        });
        return `User with username ${username} deleted successfully.`;
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('Database error while deleting user. See server log for details.');
    }
};

const storeResetToken = async (username: string, token: string, expires: Date): Promise<void> => {
    await database.user.update({
        where: { username },
        data: { resetToken: token, resetTokenExpires: expires },
    });
};

// repository/user.db.ts

export const findByResetToken = async (
    token: string
): Promise<{ username: string; resetTokenExpires: Date } | null> => {
    const rec = await database.user.findFirst({
        where: { resetToken: token },
        select: { username: true, resetTokenExpires: true },
    });
    // If no record, or expiry is null, bail out
    if (!rec || rec.resetTokenExpires === null) {
        return null;
    }
    // Now TypeScript knows resetTokenExpires is a Date
    return {
        username: rec.username,
        resetTokenExpires: rec.resetTokenExpires,
    };
};

const updatePassword = async (username: string, hashedPassword: string): Promise<void> => {
    await database.user.update({
        where: { username },
        data: { password: hashedPassword },
    });
};

const clearResetToken = async (username: string): Promise<void> => {
    await database.user.update({
        where: { username },
        data: { resetToken: null, resetTokenExpires: null },
    });
};

export default {
    getAllPlayers,
    getAllUsers,
    getUserById,
    updateUser,
    getUserByEmail,
    getUsersByRole,
    getUserByUsername,
    createUser,
    removeUser,
    storeResetToken,
    findByResetToken,
    updatePassword,
    clearResetToken,
};
