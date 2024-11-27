/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average} from "@/util";
import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageRemovedLineCount = (prStatsList: PRStats[]): IResult<number> => {
    const value = average(prStatsList.map(({removedLineCount}) => removedLineCount.value));

    return {value, message: `Average number of removed lines: ${value.toFixed(2)}`};
};
