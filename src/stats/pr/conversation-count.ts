/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const conversationCount = (pr: PR): IResult<number> => {
    const {timeline} = pr;
    const value = timeline.conversations.length;

    return {value, message: `Number of conversations: ${value}`};
};
