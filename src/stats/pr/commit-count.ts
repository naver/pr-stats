/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const commitCount = (pr: PR): IResult<number> => {
    const value = pr.timeline.commits.length;

    return {value, message: `Number of commits: ${value}`};
};
