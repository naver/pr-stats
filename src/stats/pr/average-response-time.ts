/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {PR} from "@/data";
import type {IResult} from "@/types";

export const averageResponseTime = (pr: PR): IResult<number> => {
    const {reviewerInfos} = pr;
    const responseTimes = reviewerInfos
        .flatMap(reviewerInfo => reviewerInfo.responseTimes)
        .filter((t): t is number => !!t);
    const value = average(responseTimes);

    return {value, message: `Average response time: ${printTime(value)}`};
};
