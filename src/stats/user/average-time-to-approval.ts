/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {User} from "@/data";
import type {IResult} from "@/types";

export const averageTimeToApproval = (user: User): IResult<number> => {
    const timesToApprovals = user.reviewInfos.flatMap(info => info.timesToApprovals).filter(t => t);

    const value = average(timesToApprovals);

    return {value, message: `Average time to approval: ${printTime(value)}`};
};
