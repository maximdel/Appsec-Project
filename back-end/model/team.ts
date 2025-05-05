import { Team as TeamPrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';

export class Team {
    private id?: number;
    private name: string;
    private coach?: User;
    private players: User[];
    private description: string;

    constructor(team: {
        id?: number;
        name: string;
        coach?: User;
        players: User[];
        description: string;
    }) {
        this.validate(team);

        this.id = team.id;
        this.name = team.name;
        this.coach = team.coach;
        this.players = team.players;
        this.description = team.description;
    }

    // Needs to be properly implemented
    validate(team: { name: string; coach?: User; players: User[]; description: string }) {
        if (team.name === '' || team.name === null) {
            throw new Error('Invalid name');
        }

        if (team.coach === null) {
            throw new Error('Invalid coach');
        }
        if (team.players === null) {
            throw new Error('Invalid players');
        }
        if (team.description === '' || team.description === null) {
            throw new Error('Invalid description');
        }
    }

    // Getters
    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCoach(): User | undefined {
        return this.coach;
    }

    getPlayers(): User[] {
        return this.players;
    }

    getDescription(): string {
        return this.description;
    }

    // Setters
    setId(id: number): void {
        this.id = id;
    }

    setName(name: string): void {
        this.name = name;
    }

    setCoach(coach: User): void {
        this.coach = coach;
    }

    setPlayers(players: User[]): void {
        this.players = players;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    static from(team: TeamPrisma & { coach?: UserPrisma | null; players?: UserPrisma[] }): Team {
        return new Team({
            id: team.id,
            name: team.name,
            coach: team.coach ? User.from(team.coach) : undefined,
            players: team.players ? team.players.map((player) => User.from(player)) : [],
            description: team.description,
        });
    }

    // static from({
    //     id,
    //     name,
    //     coach,
    //     players,
    //     description,
    // }: TeamPrisma & { coach: UserPrisma; players: UserPrisma[] }): Team {
    //     return new Team({
    //         id: id,
    //         name: name,
    //         coach: coach ? User.from(coach) : undefined,
    //         players: players.map((player) => User.from(player)),
    //         description: description,
    //     });
    // }

    // static from(
    //     team: TeamPrisma & {
    //         coach: UserPrisma | null;
    //         players: UserPrisma[];
    //     }
    // ) {
    //     return new Team({
    //         id: team.id,
    //         name: team.name,
    //         coach: team.coach ? User.from(team.coach) : undefined,
    //         players: team.players.map((player) => User.from(player)),
    //         description: team.description,
    //     });
    // }

    // static from(teamPrisma: TeamPrisma & { players: UserPrisma[] }): Team {
    //     return new Team({
    //         id: teamPrisma.id,
    //         name: teamPrisma.name,
    //         description: teamPrisma.description,
    //         players: teamPrisma.players.map((user) => User.from(user)),
    //     });
    // }

    // static from({
    //     id,
    //     name,
    //     coach,
    //     players,
    //     description,
    // }: TeamPrisma & { players: UserPrisma[] }): Team {
    //     return new Team({
    //         id: teamPrisma.id,
    //         name: teamPrisma.name,
    //         description: teamPrisma.description,
    //         players: teamPrisma.players.map((user) => User.from(user)),
    //     });
    // }

    equals(team: Team): boolean {
        return (
            this.id === team.getId() &&
            this.name === team.getName() &&
            this.coach === team.getCoach() &&
            this.players === team.getPlayers() &&
            this.description === team.getDescription()
        );
    }
}
