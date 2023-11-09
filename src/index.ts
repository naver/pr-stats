/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import * as core from "@actions/core";
import {ActionContext} from "./context";
import {statsToOutput, print, type IOutput} from "@/output";
import * as api from "./api";
import {PR, User} from "@/data";
import type {IPRData, TStatsType} from "./types";
import {createPRStats, createUserStats, createPRListStats} from "./output";
import {type IRefinedPRData, refine} from "./refine";

interface IProcessedData {
    prs: PR[];
    users: User[];
}

const actionContext = ActionContext.getInstance();

const getPRNumbers = async (): Promise<number[]> => {
    const {count, period} = actionContext.config;

    return api.listPRs(count, period).then(prs => prs.map(({number}) => number));
};

const fetchData = async (prNumber: number): Promise<IPRData> => {
    const [pr, events, reviews, comments, reviewComments] = await Promise.all([
        api.getPR(prNumber),
        api.listEventsForTimeline(prNumber),
        api.listReviews(prNumber),
        api.listComments(prNumber),
        api.listReviewComments(prNumber),
    ]);

    return {pr, events, reviews, comments, reviewComments};
};

const collectPRInfos = async (prNumbers: number[]): Promise<IRefinedPRData[]> => {
    const prInfos: IRefinedPRData[] = [];

    // secondary rate limit 에러를 피하기 위해 하나씩 요청
    for (const number of prNumbers) {
        const info = await fetchData(number).then(refine);

        prInfos.push(info);
    }

    return prInfos;
};

const addPRsToUsers = (prs: PR[]): void => {
    prs.forEach(pr => {
        pr.reviewerInfos.forEach(({user}) => user.addRequestedPR(pr));
        pr.assignees.forEach(user => user.addAssignedPR(pr));
    });
};

const extractTargetData = (prInfos: IRefinedPRData[]): IProcessedData => {
    const mergedPRs = prInfos.map(({prInfo, activities}) => new PR(prInfo, activities)).filter(pr => pr.merged);

    addPRsToUsers(mergedPRs);

    return {
        prs: mergedPRs,
        users: User.allUsers.filter(({requestedPRs, assignedPRs}) => requestedPRs.length || assignedPRs.length),
    };
};

const calculateStats = ({prs, users}: IProcessedData): Record<TStatsType, object[]> => {
    const {calculator} = actionContext.config;

    const prStatsList = prs.map(pr => createPRStats(pr, calculator.pr));

    return {
        pr: prStatsList,
        user: users.map(user => createUserStats(user, calculator.user)),
        prList: [createPRListStats(prStatsList, calculator.prList)],
    };
};

const convertStatsToOutput = (groupedStats: Record<TStatsType, object[]>): Record<TStatsType, IOutput[]> => {
    const {stats: targetStats} = actionContext.config;

    return Object.fromEntries(
        Object.entries(groupedStats)
            .filter(([type]: [TStatsType, object[]]) => !!targetStats[type]?.length)
            .map(([type, statsList]: [TStatsType, object[]]) => [
                type,
                statsList.map(stats => statsToOutput(stats, targetStats[type])),
            ]),
    ) as Record<TStatsType, IOutput[]>;
};

const run = async (): Promise<void> => {
    try {
        await actionContext.initialize();

        getPRNumbers()
            .then(collectPRInfos)
            .then(extractTargetData)
            .then(calculateStats)
            .then(convertStatsToOutput)
            .then(print);
    } catch (error) {
        core.setFailed((error as Error).message);
    }
};

run();
