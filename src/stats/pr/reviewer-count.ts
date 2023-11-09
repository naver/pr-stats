/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const reviewerCount = (pr: PR): IResult<number> => {
    const value = pr.reviewerInfos.length;

    return {value, message: `Number of reviewers: ${value}`};
};
