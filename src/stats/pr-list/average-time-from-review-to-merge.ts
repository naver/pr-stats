/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average, printTime} from "@/util";
import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageTimeFromReviewToMerge = (prStatsList: PRStats[]): IResult<number> => {
    const value = average(prStatsList.map(({timeFromReviewToMerge}) => timeFromReviewToMerge.value));

    return {value, message: `Average time from review to merge: ${printTime(value)}`};
};
