/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const commentCount = (pr: PR): IResult<number> => {
    const {reviewerInfos} = pr;
    const value = reviewerInfos.reduce((acc, {commentCount}) => acc + commentCount, 0);

    return {value, message: `Number of comments: ${value}`};
};
