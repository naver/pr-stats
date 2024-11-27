/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const participationCount = (pr: PR): IResult<number> => {
    const {reviewerInfos} = pr;
    const value = reviewerInfos.filter(({participated}) => participated).length;

    return {value, message: `Number of participations: ${value}`};
};
