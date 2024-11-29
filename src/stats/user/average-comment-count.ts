/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average} from "@/util";
import type {IResult} from "@/types";
import type {User} from "@/data";

export const averageCommentCount = (user: User): IResult<number> => {
    const value = average(user.reviewInfos.map(({commentCount}) => commentCount));

    return {value, message: `Average number of comments: ${value.toFixed(2)}`};
};
