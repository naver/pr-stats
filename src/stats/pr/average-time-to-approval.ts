/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {PR} from "@/data";
import type {IResult} from "@/types";

export const averageTimeToApproval = (pr: PR): IResult<number> => {
    const {reviewerInfos} = pr;
    const timesToApprovals = reviewerInfos
        .flatMap(reviewerInfo => reviewerInfo.timesToApprovals)
        .filter((t): t is number => !!t);
    const value = average(timesToApprovals);

    return {value, message: `Average time to approval: ${printTime(value)}`};
};
