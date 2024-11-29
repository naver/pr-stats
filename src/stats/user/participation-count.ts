/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {User} from "@/data";
import type {IResult} from "@/types";

export const participationCount = (user: User): IResult<number> => {
    const value = user.reviewInfos.filter(({participated}) => participated).length;

    return {value, message: `Number of participations: ${value}`};
};
