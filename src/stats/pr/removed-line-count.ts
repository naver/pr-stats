/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const removedLineCount = (pr: PR): IResult<number> => {
    const value = pr.deletions;

    return {value, message: `Removed lines: -${value}`};
};
