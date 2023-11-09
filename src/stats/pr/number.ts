/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const number = (pr: PR): IResult<number> => {
    const value = pr.number;

    return {
        value,
        message: `***** PR #${value} *****`,
    };
};
