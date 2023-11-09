/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {User} from "@/data";
import type {IResult} from "@/types";

export const averageLinesChangedPerCommit = (user: User): IResult<number> => {
    const {assignedPRs} = user;

    const totalChangedLineCount = assignedPRs.map(pr => pr.changedLineCount).reduce((acc, cur) => acc + cur, 0);
    const totalNonMergeCommitCount = assignedPRs
        .map(pr => pr.timeline.nonMergeCommits.length)
        .reduce((acc, cur) => acc + cur, 0);

    const value = totalChangedLineCount / totalNonMergeCommitCount;

    return {value, message: `Average lines changed per commit: ${Math.floor(value)}`};
};
