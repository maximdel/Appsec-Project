import { Goal as GoalPrisma, Role, Team as TeamPrisma, User as UserPrisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Goal } from './goal';
import { Team } from './team';

export class User {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private password: string;
    private birthDate: Date;
    private email: string;
    private username: string;
    private description?: string;
    private role: Role;

    private coachOfTeam?: Team;
    private playerOfTeam?: Team;
    private goals: Goal[];

    constructor(user: {
        id?: number;
        firstName: string;
        lastName: string;
        password: string;
        birthDate: Date;
        email: string;
        username: string;
        description?: string;
        role?: Role;
        coachOfTeam?: Team;
        playerOfTeam?: Team;
        goals?: Goal[];
    }) {
        this.validate(user);

        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.birthDate = user.birthDate;
        this.email = user.email;
        this.username = user.username;
        this.description = user.description;
        this.role = user.role || Role.USER;
        this.coachOfTeam = user.coachOfTeam;
        this.playerOfTeam = user.playerOfTeam;
        this.goals = user.goals || [];
    }

    validate(user: {
        firstName: string;
        lastName: string;
        password: string;
        birthDate: Date | string; // Allowing for the possibility of it being a string
        email: string;
        username: string;
        description?: string;
        role?: Role;
    }) {
        if (!user.firstName || user.firstName.trim() === '')
            throw new Error('First name cannot be empty.');
        if (!user.lastName || user.lastName.trim() === '')
            throw new Error('Last name cannot be empty.');
        if (!user.password || user.password.length < 8)
            throw new Error('Password needs to be at least 8 characters long.');
        if (!user.email || user.email.trim() === '') throw new Error('Email cannot be empty.');

        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(user.email)) throw new Error('Email does not have a correct format.');

        if (!user.username || user.username.trim() === '')
            throw new Error('Username cannot be empty.');

        if (user.description && user.description.trim().length === 0) {
            throw new Error('Description cannot be empty if provided.');
        }

        // Ensure birthDate is a Date object
        const birthDate =
            user.birthDate instanceof Date ? user.birthDate : new Date(user.birthDate);

        if (isNaN(birthDate.getTime())) {
            throw new Error('Invalid birth date.');
        }

        if (birthDate.getTime() >= new Date().getTime())
            throw new Error('Birth date must be in the past.');

        const validRoles = Object.values(Role);
        if (user.role) {
            if (!validRoles.includes(user.role))
                throw new Error(
                    `Invalid role. Role must be one of the following: ${validRoles.join(', ')}.`
                );
        }
    }

    // Getters
    getId(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getPassword(): string {
        return this.password;
    }

    getBirthDate(): Date {
        return this.birthDate;
    }

    getEmail(): string {
        return this.email;
    }

    getUsername(): string {
        return this.username;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getRole(): Role {
        return this.role;
    }

    getCoachOfTeam(): Team | undefined {
        return this.coachOfTeam;
    }

    getPlayerOfTeam(): Team | undefined {
        return this.playerOfTeam;
    }

    getGoals(): Goal[] {
        return this.goals;
    }

    setFirstName(firstName: string): void {
        if (!firstName) throw new Error("First name can't be empty.");
        this.firstName = firstName;
    }

    setLastName(lastName: string): void {
        if (!lastName) throw new Error("Last name can't be empty.");
        this.lastName = lastName;
    }

    async setPassword(password: string): Promise<void> {
        if (password.length < 8) throw new Error('Password must be at least 8 characters.');
        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter.');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        this.password = hashedPassword;
    }

    setBirthDate(birthDate: Date): void {
        if (birthDate.getTime() >= new Date().getTime())
            throw new Error('Birth date must be in the past.');
        this.birthDate = birthDate;
    }

    setEmail(email: string): void {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) throw new Error('Invalid email format.');
        this.email = email;
    }

    setUsername(username: string): void {
        if (!username) throw new Error("Username can't be empty.");
        this.username = username;
    }

    setDescription(description: string): void {
        if (!description || description.trim() === '')
            throw new Error("Description can't be empty.");
        this.description = description;
    }

    setRole(role: Role): void {
        if (!role) throw new Error("Role can't be empty.");
        this.role = role;
    }

    setCoachOfTeam(team: Team): void {
        this.coachOfTeam = team;
    }

    setPlayerOfTeam(team: Team): void {
        this.playerOfTeam = team;
    }

    setGoals(goals: Goal[]): void {
        this.goals = goals;
    }

    toPublic() {
        const { password, ...safeUser } = this;
        return safeUser;
    }

    equals(user: User): boolean {
        return (
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.password === user.getPassword() &&
            this.birthDate === user.getBirthDate() &&
            this.email === user.getEmail() &&
            this.username === user.getUsername() &&
            this.description === user.getDescription() &&
            this.role === user.getRole()
        );
    }

    static from({
        id,
        firstName,
        lastName,
        password,
        birthDate,
        email,
        username,
        description,
        role,
        coachOfTeam,
        playerOfTeam,
        goals,
    }: UserPrisma & {
        coachOfTeam?: TeamPrisma | null;
        playerOfTeam?: TeamPrisma | null;
        goals?: (GoalPrisma & { team: TeamPrisma; player: UserPrisma })[];
    }): User {
        return new User({
            id,
            firstName,
            lastName,
            password,
            birthDate,
            email,
            username,
            description: description ?? undefined,
            role,
            coachOfTeam: coachOfTeam ? Team.from(coachOfTeam) : undefined,
            playerOfTeam: playerOfTeam ? Team.from(playerOfTeam) : undefined,
            goals: goals ? goals.map((goal) => Goal.from(goal)) : [],
        });
    }
}
