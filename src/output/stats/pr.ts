/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {type PR} from "@/data";
import type {TPRStats, IResult, TPRStatsCalculator, TDefaultPRStats} from "@/types";
import {defaultPRCalculator} from "@/stats";

export class PRStats implements TDefaultPRStats {
    private _pr: PR;

    constructor(pr: PR, calculator: Record<keyof TPRStats, TPRStatsCalculator>) {
        this._pr = pr;

        Object.entries(calculator).forEach(([key, fn]: [keyof TPRStats, TPRStatsCalculator]) => {
            (this as any)[key] = fn(pr);
        });
    }

    get pr() {
        return this._pr;
    }

    number: IResult<number>;
    title: IResult<string>;
    addedLineCount: IResult<number>;
    removedLineCount: IResult<number>;
    changedLineCount: IResult<number>;
    fileCount: IResult<number>;
    commitCount: IResult<number>;
    commentCount: IResult<number>;
    conversationCount: IResult<number>;
    reviewerCount: IResult<number>;
    approvalCount: IResult<number>;
    participationCount: IResult<number>;
    timeFromReviewToMerge: IResult<number>;
    averageResponseTime: IResult<number>;
    averageTimeToApproval: IResult<number>;
    averageLinesChangedPerCommit: IResult<number>;
}

export const createPRStats = (
    pr: PR,
    calculator: Record<keyof TPRStats, TPRStatsCalculator> = defaultPRCalculator,
): PRStats => {
    return new PRStats(pr, calculator);
};
