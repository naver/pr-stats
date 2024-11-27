/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {User} from "@/data";
import type {IResult, TDefaultUserStats, TUserStats, TUserStatsCalculator} from "@/types";
import {defaultUserCalculator} from "@/stats";

export class UserStats implements TDefaultUserStats {
    constructor(user: User, calculator: Record<keyof TUserStats, TUserStatsCalculator>) {
        Object.entries(calculator).forEach(([key, fn]: [keyof TUserStats, TUserStatsCalculator]) => {
            (this as any)[key] = fn(user);
        });
    }

    id: IResult<string>;
    requestedCount: IResult<number>;
    participationCount: IResult<number>;
    participationRate: IResult<number>;
    averageCommentCount: IResult<number>;
    averageResponseTime: IResult<number>;
    averageTimeToApproval: IResult<number>;
    averageLinesChangedPerCommit: IResult<number>;
}

export const createUserStats = (
    user: User,
    calculator: Record<keyof TUserStats, TUserStatsCalculator> = defaultUserCalculator,
): UserStats => {
    return new UserStats(user, calculator);
};
