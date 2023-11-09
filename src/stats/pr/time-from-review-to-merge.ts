/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {printTime} from "@/util";
import type {PR} from "@/data";
import type {IResult} from "@/types";

export const timeFromReviewToMerge = (pr: PR): IResult<number> => {
    const {timeline} = pr;
    const value = Number(timeline.mergedAt) - Number(timeline.firstRequestedAt);

    return {value, message: `Time from review to merge: ${printTime(value)}`};
};
