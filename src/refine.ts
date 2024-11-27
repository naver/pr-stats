/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {ActionContext} from "./context";
import {comments as refineComments, events as refineEvents, type Activity} from "@/data";
import type {IPRInfo, IPRData} from "./types";

const filterIgnoreUsers = (data: Activity[]): Activity[] =>
    data.filter(({user}) => !ActionContext.getInstance().config.ignoreUsers.includes(user.id));

export const refinePR = ({pr}: IPRData): IPRInfo => {
    const {
        number,
        title,
        merged,
        additions,
        deletions,
        changed_files: changedFiles,
        user: {login: userId},
        assignees,
    } = pr;

    const assigneeIds = assignees?.map(({login}) => login) ?? [];

    return {number, title, merged, additions, deletions, changedFiles, userId, assigneeIds};
};
export const refineActivities = (data: IPRData): Activity[] => {
    return [...refineComments(data), ...refineEvents(data)].sort(
        (a1, a2) => Number(a1.createdAt) - Number(a2.createdAt),
    );
};

export interface IRefinedPRData {
    prInfo: IPRInfo;
    activities: Activity[];
}

export const refine = (data: IPRData): IRefinedPRData => {
    const activities = filterIgnoreUsers(refineActivities(data));
    const prInfo = refinePR(data);

    return {prInfo, activities};
};
