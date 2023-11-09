/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageLinesChangedPerCommit = (prStatsList: PRStats[]): IResult<number> => {
    const totalChangedLineCount = prStatsList
        .map(({addedLineCount, removedLineCount}) => addedLineCount.value + removedLineCount.value)
        .reduce((acc, cur) => acc + cur, 0);
    const totalNonMergeCommitCount = prStatsList
        .map(({pr}) => pr.timeline.nonMergeCommits.length)
        .reduce((acc, cur) => acc + cur, 0);
    const value = totalChangedLineCount / totalNonMergeCommitCount;

    return {value, message: `Average lines changed per commit: ${Math.floor(value)}`};
};
