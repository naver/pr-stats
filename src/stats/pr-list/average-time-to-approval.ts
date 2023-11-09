/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageTimeToApproval = (prStatsList: PRStats[]): IResult<number> => {
    const allTimesToApproval = prStatsList.flatMap(({pr}) =>
        pr.reviewerInfos.flatMap(({timesToApprovals}) => timesToApprovals).filter((t): t is number => !!t),
    );
    const value = average(allTimesToApproval);

    return {value, message: `Average time to approval: ${printTime(value)}`};
};
