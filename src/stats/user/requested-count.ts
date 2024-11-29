/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {User} from "@/data";
import type {IResult} from "@/types";

export const requestedCount = (user: User): IResult<number> => {
    const value = user.requestedPRs.length;

    return {value, message: `Number of reviews requested: ${value}`};
};
