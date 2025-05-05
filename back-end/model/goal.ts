import { Goal as GoalPrisma, User as UserPrisma, Team as TeamPrisma } from '@prisma/client';
import { Team } from './team';
import { User } from './user';

export class Goal {
    private id: number;
    private time: number;
    private team: Team;
    private player: User;

    constructor(goal: { id: number; time: number; team: Team; player: User }) {
        this.validate(goal);

        this.id = goal.id;
        this.time = goal.time;
        this.team = goal.team;
        this.player = goal.player;
    }

    // Needs to properly be implemented
    validate(goal: { id: number; time: number; team: Team; player: User }) {
        if (!goal.id) {
            throw new Error('Goal id is required');
        }

        if (!goal.time) {
            throw new Error('Goal time is required');
        }
        if (goal.time < 0) {
            throw new Error('Goal time must be greater than 0');
        }
        if (goal.time > 90) {
            throw new Error('Goal time must be under 90');
        }
    }

    // Getters
    getId() {
        return this.id;
    }

    getTime() {
        return this.time;
    }

    getTeam() {
        return this.team;
    }

    getPlayer() {
        return this.player;
    }

    // Setters
    setId(id: number) {
        this.id = id;
    }

    setTime(time: number) {
        this.time = time;
    }

    setTeam(team: Team) {
        this.team = team;
    }

    setPlayer(player: User) {
        this.player = player;
    }

    static from({ id, time, team, player }: GoalPrisma & { team: TeamPrisma; player: UserPrisma }) {
        return new Goal({
            id,
            time,
            team: Team.from(team),
            player: User.from(player),
        });
    }

    equals(goal: Goal) {
        return (
            this.id === goal.id &&
            this.time === goal.time &&
            this.team === goal.team &&
            this.player === goal.player
        );
    }
}
