/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const title = (pr: PR): IResult<string> => {
    const value = pr.title;

    return {
        value,
        message: `Title: ${value}`,
    };
};
