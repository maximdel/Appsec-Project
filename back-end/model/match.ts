import {
    Goal as GoalPrisma,
    Location as LocationPrisma,
    Match as MatchPrisma,
    MatchTeam as MatchTeamPrisma,
    Team as TeamPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { Goal } from './goal';
import { Location } from './location';
import { MatchTeam } from './matchTeam';

export class Match {
    private id: number;
    private date: Date;
    private location: Location;
    private goals: Goal[];
    private teams: MatchTeam[];

    constructor(match: {
        id: number;
        date: Date;
        location: Location;
        goals?: Goal[];
        teams?: MatchTeam[];
    }) {
        this.validate(match);

        this.id = match.id;
        this.date = match.date;
        this.location = match.location;
        this.goals = match.goals || [];
        this.teams = match.teams || [];
    }

    // Needs to be properly implemented
    validate(match: { id: number; date: Date; location: Location }): void {
        if (!match.id) {
            throw new Error('Match id is required');
        }
        if (!match.date) {
            throw new Error('Match date is required');
        }
        if (!match.location) {
            throw new Error('Match location is required');
        }
    }

    // Getters
    getId(): number {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }

    getLocation(): Location {
        return this.location;
    }

    getGoals(): Goal[] {
        return this.goals;
    }

    getTeams(): MatchTeam[] {
        return this.teams;
    }

    // Setters
    setId(id: number): void {
        this.id = id;
    }

    setDate(date: Date): void {
        this.date = date;
    }

    setLocation(location: Location): void {
        this.location = location;
    }

    setGoals(goals: Goal[]): void {
        this.goals = goals;
    }

    setTeams(teams: MatchTeam[]): void {
        this.teams = teams;
    }

    // static from({
    //     id,
    //     date,
    //     location,
    // }: MatchPrisma & {
    //     location: LocationPrisma;
    // }): Match {
    //     return new Match({
    //         id,
    //         date,
    //         location: Location.from(location),
    //     });
    // }

    static from({
        id,
        date,
        location,
        goals,
        teams,
    }: MatchPrisma & {
        location: LocationPrisma;
        goals?: (GoalPrisma & { team: TeamPrisma; player: UserPrisma })[];
        teams?: (MatchTeamPrisma & {
            team: TeamPrisma;
            goals: (GoalPrisma & { team: TeamPrisma; player: UserPrisma })[];
        })[];
    }): Match {
        return new Match({
            id,
            date,
            location: Location.from(location),
            goals: goals ? goals.map((goal) => Goal.from(goal)) : [],
            teams: teams
                ? teams.map((team) =>
                      MatchTeam.from({
                          ...team,
                          team: team.team,
                          goals: team.goals || [],
                      })
                  )
                : [],
        });
    }

    // static from({
    //     id,
    //     date,
    //     location,
    //     goals,
    //     teams,
    // }: MatchPrisma & {
    //     location: LocationPrisma;
    //     goals: GoalPrisma[];
    //     teams: Team[];
    // }): Match {
    //     return new Match({
    //         id,
    //         date,
    //         location: Location.from(location),
    //         goals: goals.map((goal) => Goal.from(goal)),
    //         teams: teams.map((team) => Team.from(team)),
    //     });
    // }

    // static from({
    //     id,
    //     date,
    //     location,
    //     goals,
    //     teams,
    // }: MatchPrisma & {
    //     location: LocationPrisma;
    //     goals: GoalPrisma[];
    //     teams: (TeamPrisma & { players: UserPrisma[] })[];
    // }): Match {
    //     return new Match({
    //         id,
    //         date,
    //         location: Location.from(location),
    //         goals: goals.map((goal) => Goal.from(goal)),
    //         teams: teams.map((team) => Team.from(team)), // Use Team.from here
    //     });
    // }
}
