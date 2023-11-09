/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {
    TCommentListData,
    TEventListForTimelineData,
    TPRData,
    TPRListData,
    TResponseData,
    TReviewCommentListData,
    TReviewListData,
} from "@/types";
import {ActionContext} from "./context";

const MAX_PER_PAGE = 100;

const actionContext = ActionContext.getInstance();
const {owner, repo, octokit} = actionContext;

const fetchByPeriod = async <TReq extends (...args: any[]) => Promise<{data: R[]}>, R>(
    request: TReq,
    params: object,
    period: readonly [start: Date, end: Date],
    getCreatedAt: (data: R) => Date,
): Promise<TResponseData<TReq>> => {
    const [startDate, endDate] = period;
    let lastCreatedAt: Date;
    let [page, len] = [1, 0];
    const result: R[] = [];

    do {
        const {data} = await request({...params, per_page: MAX_PER_PAGE, page});
        actionContext.increaseRequestCount();

        if (!data.length) {
            break;
        }

        result.push(...data);

        [page, len] = [page + 1, data.length];
        lastCreatedAt = getCreatedAt(data.at(-1));
    } while (len === MAX_PER_PAGE && lastCreatedAt > startDate);

    return result.filter(data => {
        const createdAt = getCreatedAt(data);

        return createdAt >= startDate && createdAt <= endDate;
    });
};

const fetchAllPages = async <TReq extends (...args: any[]) => Promise<{data: any}>>(
    request: TReq,
    params: object,
    maxCount = Number.POSITIVE_INFINITY,
): Promise<TResponseData<TReq>> => {
    let [page, len, count] = [1, 0, 0];
    const result = [];

    do {
        const {data} = await request({...params, per_page: MAX_PER_PAGE, page});
        actionContext.increaseRequestCount();

        result.push(...data);

        [page, len, count] = [page + 1, data.length, count + data.length];
    } while (len === MAX_PER_PAGE && count < maxCount);

    return result.slice(0, maxCount);
};

export const getPR = async (number: number): Promise<TPRData> => {
    const {data: pr} = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: number,
    });
    actionContext.increaseRequestCount();

    return pr;
};
export const listEventsForTimeline = (number: number): Promise<TEventListForTimelineData> =>
    fetchAllPages(octokit.rest.issues.listEventsForTimeline, {
        owner,
        repo,
        issue_number: number,
    });
export const listReviews = (number: number): Promise<TReviewListData> =>
    fetchAllPages(octokit.rest.pulls.listReviews, {
        owner,
        repo,
        pull_number: number,
    });
export const listComments = (number: number): Promise<TCommentListData> =>
    fetchAllPages(octokit.rest.issues.listComments, {
        owner,
        repo,
        issue_number: number,
    });
export const listReviewComments = (number: number): Promise<TReviewCommentListData> =>
    fetchAllPages(octokit.rest.pulls.listReviewComments, {
        owner,
        repo,
        pull_number: number,
    });
export const listPRs = (count: number, period: readonly [start: Date, end: Date] | null): Promise<TPRListData> => {
    const api = octokit.rest.pulls.list;
    const params = {
        owner,
        repo,
        state: "closed",
        base: actionContext.config.baseBranch,
    };

    return period
        ? fetchByPeriod(api, params, period, pr => new Date(pr.created_at))
        : fetchAllPages(api, params, count);
};
