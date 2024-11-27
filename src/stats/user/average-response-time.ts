/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {User} from "@/data";
import type {IResult} from "@/types";

export const averageResponseTime = (user: User): IResult<number> => {
    const responseTimes = user.reviewInfos.flatMap(info => info.responseTimes).filter(t => t);

    const value = average(responseTimes);

    return {value, message: `Average response time: ${printTime(value)}`};
};
