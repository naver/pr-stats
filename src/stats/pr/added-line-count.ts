/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const addedLineCount = (pr: PR): IResult<number> => {
    const value = pr.additions;

    return {value, message: `Added lines: +${value}`};
};
