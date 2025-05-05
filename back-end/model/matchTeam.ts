import {
    MatchTeam as MatchTeamPrisma,
    Goal as GoalPrisma,
    Team as TeamPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { Goal } from './goal';
import { Team } from './team';

export class MatchTeam {
    private matchId: number;
    private team: Team;
    private goals: Goal[];

    constructor(matchTeam: { matchId: number; team: Team; goals: Goal[] }) {
        this.matchId = matchTeam.matchId;
        this.team = matchTeam.team;
        this.goals = matchTeam.goals;
    }

    static from({
        matchId,
        team,
        goals,
    }: MatchTeamPrisma & {
        team: TeamPrisma;
        goals: (GoalPrisma & { team: TeamPrisma; player: UserPrisma })[];
    }): MatchTeam {
        return new MatchTeam({
            matchId,
            team: Team.from(team),
            goals: goals.map((goal) => Goal.from(goal)),
        });
    }

    // static from({ matchId, team, goals }: MatchTeamPrisma & { team: TeamPrisma; goals: GoalPrisma}): MatchTeam {
    //     return new MatchTeam({
    //         matchId,
    //         team: Team.from(team),
    //         goals: goals.map((goal) => Goal.from(goal)),
    //     });
    // }
}
