/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {timeFromReviewToMerge} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");

describe("PR > timeFromReviewToMerge", () => {
    it("첫 리뷰 요청 시점부터 머지까지 걸린 시간을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const firstRequestTime = 10;
        const mergeTime = 100;
        const mergedAt = addMinutes(MOCK_CREATED_DATE, mergeTime);
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, firstRequestTime)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 25)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, mergedAt),
        ];

        // when
        const result = timeFromReviewToMerge(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(num.minToMs(mergeTime - firstRequestTime));
    });
});
