/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {PR} from "@/data";
import type {IResult} from "@/types";

export const approvalCount = (pr: PR): IResult<number> => {
    const {reviewerInfos} = pr;
    const value = reviewerInfos.filter(reviewerInfo => reviewerInfo.finallyApproved).length;

    return {
        value,
        message: `Number of approvals: ${value}`,
    };
};
