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
};
