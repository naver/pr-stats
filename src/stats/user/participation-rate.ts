/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {User} from "@/data";
import type {IResult} from "@/types";

export const participationRate = (user: User): IResult<number> => {
    const participationCount = user.reviewInfos.filter(({participated}) => participated).length;
    const requestedCount = user.requestedPRs.length;
    const value = (participationCount / requestedCount) * 100;

    return {value, message: `Participation rate: ${value.toFixed(2)}%`};
};
