/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageResponseTime = (prStatsList: PRStats[]): IResult<number> => {
    const allResponseTimes = prStatsList.flatMap(({pr}) =>
        pr.reviewerInfos.flatMap(({responseTimes}) => responseTimes).filter((t): t is number => !!t),
    );
    const value = average(allResponseTimes);

    return {value, message: `Average response time: ${printTime(value)}`};
};
