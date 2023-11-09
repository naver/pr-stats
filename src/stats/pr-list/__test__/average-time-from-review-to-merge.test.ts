/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageTimeFromReviewToMerge} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");

describe("PRList > averageTimeFromReviewToMerge", () => {
    it("특정 PR 목록에서 각 PR의 첫 리뷰 요청 시점부터 머지까지 걸리 시간의 평균을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const [firstRequestTime1, firstRequestTime2, firstRequestTime3] = [5, 15, 10];
        const [mergeTime1, mergeTime2, mergeTime3] = [150, 580, 700];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, firstRequestTime1)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, firstRequestTime1)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, firstRequestTime1)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 70)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 120)),
            dc.createMerge(author, addMinutes(MOCK_CREATED_DATE, mergeTime1)),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, firstRequestTime2)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, firstRequestTime2)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 350)),
            dc.createMerge(author, addMinutes(MOCK_CREATED_DATE, mergeTime2)),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, firstRequestTime3)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, addMinutes(MOCK_CREATED_DATE, mergeTime3)),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageTimeFromReviewToMerge([prStats1, prStats2, prStats3]);

        const mockTimesFromReviewToMerge = [
            mergeTime1 - firstRequestTime1,
            mergeTime2 - firstRequestTime2,
            mergeTime3 - firstRequestTime3,
        ].map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockTimesFromReviewToMerge));
    });
});
