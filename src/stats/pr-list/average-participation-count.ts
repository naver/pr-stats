/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {average} from "@/util";
import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const averageParticipationCount = (prStatsList: PRStats[]): IResult<number> => {
    const value = average(prStatsList.map(({participationCount}) => participationCount.value));

    return {value, message: `Average number of participations: ${value.toFixed(2)}`};
};
