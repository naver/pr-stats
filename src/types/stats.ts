/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {TOutputMethod} from "@/const";
import type {PR, User} from "@/data";
import type {PRStats} from "@/output";

export interface IResult<T = unknown> {
    value: T;
    message: string;
}

type TStats<T> = {
    [P in keyof T]: IResult<T[P]>;
};

export interface IDefaultPRStats {
    number: number;
    title: string;
    createdAt: number;
    mergedAt: number;
    addedLineCount: number;
    removedLineCount: number;
    changedLineCount: number;
    fileCount: number;
    commitCount: number;
    commentCount: number;
    conversationCount: number;
    reviewerCount: number;
    approvalCount: number;
    participationCount: number;
    participationRate: number;
    timeFromReviewToMerge: number;
    averageResponseTime: number;
    averageTimeToApproval: number;
    averageLinesChangedPerCommit: number;
}
interface IPRStats extends IDefaultPRStats {
    [additionalStats: string]: unknown;
}

export type TDefaultPRStats = TStats<IDefaultPRStats>;
export type TPRStats = TStats<IPRStats>;

export interface IDefaultPRListStats {
    averageAddedLineCount: number;
    averageRemovedLineCount: number;
    averageChangedLineCount: number;
    averageFileCount: number;
    averageCommitCount: number;
    averageCommentCount: number;
    averageConversationCount: number;
    averageReviewerCount: number;
    averageApprovalCount: number;
    averageParticipationCount: number;
    averageTimeFromReviewToMerge: number;
    averageResponseTime: number;
    averageTimeToApproval: number;
    averageLinesChangedPerCommit: number;
    participationRate: number;
}

interface IPRListStats extends IDefaultPRListStats {
    [additionalStats: string]: unknown;
}

export type TDefaultPRListStats = TStats<IDefaultPRListStats>;
export type TPRListStats = TStats<IPRListStats>;

export interface IDefaultUserStats {
    id: string;
    requestedCount: number;
    participationCount: number;
    participationRate: number;
    averageCommentCount: number;
    averageResponseTime: number;
    averageTimeToApproval: number;
    averageLinesChangedPerCommit: number;
}

interface IUserStats extends IDefaultUserStats {
    [additionalStats: string]: unknown;
}

export type TDefaultUserStats = TStats<IDefaultUserStats>;
export type TUserStats = TStats<IUserStats>;

export type TCalculator<T = unknown> = (...args: any[]) => IResult<T>;
export type TPRStatsCalculator<T = unknown> = (pr: PR) => IResult<T>;
export type TPRListStatsCalculator<T = unknown> = (prs: PRStats[]) => IResult<T>;
export type TUserStatsCalculator<T = unknown> = (user: User) => IResult<T>;

export interface IDefaultStats extends IStats {
    pr: readonly (readonly [keyof IDefaultPRStats, TPRStatsCalculator])[];
    prList: readonly (readonly [keyof IDefaultPRListStats, TPRListStatsCalculator])[];
    user: readonly (readonly [keyof IDefaultUserStats, TUserStatsCalculator])[];
}

export interface IStats {
    pr: readonly (string | readonly [string, TPRStatsCalculator])[];
    prList: readonly (string | readonly [string, TPRListStatsCalculator])[];
    user: readonly (string | readonly [string, TUserStatsCalculator])[];
}

export interface IMergedStats extends IStats {
    pr: readonly (readonly [string, TPRStatsCalculator])[];
    prList: readonly (readonly [string, TPRListStatsCalculator])[];
    user: readonly (readonly [string, TUserStatsCalculator])[];
}

export interface IRefinedConfig {
    stats: {
        pr: readonly string[];
        prList: readonly string[];
        user: readonly string[];
    };
    calculator: {
        pr: Record<string, TPRStatsCalculator>;
        prList: Record<string, TPRListStatsCalculator>;
        user: Record<string, TUserStatsCalculator>;
    };
}

export interface IInternalConfig extends IRefinedConfig {
    output: readonly TOutputMethod[];
    ignoreUsers: string[];
    period: readonly [start: Date, end: Date] | null;
    count: number;
    baseBranch: string | undefined;
}

export type TStatsType = keyof IStats;
