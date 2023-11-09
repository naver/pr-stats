/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {getOctokit} from "@actions/github";

export type TOctokit = ReturnType<typeof getOctokit>;

export type TResponseData<TReq extends (...args: any[]) => Promise<{data: any}>> = Awaited<ReturnType<TReq>>["data"];

export type TEventListForTimelineData = TResponseData<TOctokit["rest"]["issues"]["listEventsForTimeline"]>;
export type TReviewListData = TResponseData<TOctokit["rest"]["pulls"]["listReviews"]>;
export type TCommentListData = TResponseData<TOctokit["rest"]["issues"]["listComments"]>;
export type TReviewCommentListData = TResponseData<TOctokit["rest"]["pulls"]["listReviewComments"]>;
export type TPRListData = TResponseData<TOctokit["rest"]["pulls"]["list"]>;
export type TPRData = TResponseData<TOctokit["rest"]["pulls"]["get"]>;

export type TEventData = TEventListForTimelineData extends Array<infer T> ? T : never;

export interface IPRData {
    pr: TPRData;
    events: TEventListForTimelineData;
    reviews: TReviewListData;
    comments: TCommentListData;
    reviewComments: TReviewCommentListData;
}

export interface IPRInfo {
    number: number;
    title: string;
    merged: boolean;
    additions: number;
    deletions: number;
    changedFiles: number;
    userId: any;
    assigneeIds: string[];
}

export interface IPROutput {
    number: number;
    title: string;
    fileCount: number;
    changedLineCount: number;
    addedLineCount: number;
    removedLineCount: number;
    commitCount: number;
    timeFromReviewToMerge: number;
    reviewerCount: number;
    conversationCount: number;
    approvalCount: number;
    commentCount: number;
    participationCount: number;
    averageResponseTime: number;
    averageTimeToApproval: number;
    averageLinesChangedPerCommit: number;
}

export interface IUserOutput {
    id: string;
    requestedCount: number;
    averageResponseTime: number;
    averageTimeToApproval: number;
    participationCount: number;
    averageLinesChangedPerCommit: number;
}
