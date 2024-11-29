/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const participationRate = (pr: PR): IResult<number> => {
    const reviewerCount = pr.reviewerInfos.length;
    const participationCount = pr.reviewerInfos.filter(r => r.participated).length;
    const value = (participationCount / reviewerCount) * 100;

    return {value, message: `Participation Rate: ${value.toFixed(2)}%`};
};
