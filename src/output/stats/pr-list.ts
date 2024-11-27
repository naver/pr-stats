/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {TPRListStats, IResult, TPRListStatsCalculator, TDefaultPRListStats} from "@/types";
import {defaultPRListCalculator} from "@/stats";
import type {PRStats} from "./pr";

export class PRListStats implements TDefaultPRListStats {
    constructor(prStatsList: PRStats[], calculator: Record<keyof TPRListStats, TPRListStatsCalculator>) {
        Object.entries(calculator).forEach(([key, fn]: [keyof TPRListStats, TPRListStatsCalculator]) => {
            (this as any)[key] = fn(prStatsList);
        });
    }

    averageAddedLineCount: IResult<number>;
    averageRemovedLineCount: IResult<number>;
    averageChangedLineCount: IResult<number>;
    averageFileCount: IResult<number>;
    averageCommitCount: IResult<number>;
    averageCommentCount: IResult<number>;
    averageConversationCount: IResult<number>;
    averageReviewerCount: IResult<number>;
    averageApprovalCount: IResult<number>;
    averageParticipationCount: IResult<number>;
    averageTimeFromReviewToMerge: IResult<number>;
    averageResponseTime: IResult<number>;
    averageTimeToApproval: IResult<number>;
    averageLinesChangedPerCommit: IResult<number>;
    participationRate: IResult<number>;
}

export const createPRListStats = (
    prStatsList: PRStats[],
    calculator: Record<keyof TPRListStats, TPRListStatsCalculator> = defaultPRListCalculator,
): PRListStats => {
    return new PRListStats(prStatsList, calculator);
};
