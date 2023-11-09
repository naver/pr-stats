/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {User} from "@/data";
import type {IResult} from "@/types";

export const id = (user: User): IResult<string> => {
    const value = user.id;

    return {value, message: `***** User: ${value} *****`};
};
