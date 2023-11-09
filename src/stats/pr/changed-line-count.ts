/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const changedLineCount = (pr: PR): IResult<number> => {
    const {additions, deletions} = pr;
    const value = additions + deletions;

    return {value, message: `Changed lines: ${value}`};
};
