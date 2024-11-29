/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {IResult} from "@/types";
import type {PRStats} from "@/output";

export const participationRate = (prStatsList: PRStats[]): IResult<number> => {
    const totalReviewerCount = prStatsList.reduce((acc, prStats) => acc + prStats.reviewerCount.value, 0);
    const totalParticipationCount = prStatsList.reduce((acc, prStats) => acc + prStats.participationCount.value, 0);

    const value = (totalParticipationCount / totalReviewerCount) * 100;

    return {value, message: `Participation Rate: ${value.toFixed(2)}%`};
};
