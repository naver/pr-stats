/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const averageLinesChangedPerCommit = (pr: PR): IResult<number> => {
    const {timeline, additions, deletions} = pr;
    const value = (additions + deletions) / timeline.nonMergeCommits.length;

    return {value, message: `Average lines changed per commit: ${Math.floor(value)}`};
};
