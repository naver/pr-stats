/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {averageTimeToApproval} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("User > averageTimeToApproval", () => {
    it("요청받은 모든 PR에 대해 해당 리뷰어의 첫 리뷰 요청 후 승인까지 소요된 시간들의 평균(ms)을 반환해야 한다.", () => {
        // given
        const [author1, author2, author3] = ["author1", "author2", "author3"];
        const reviewer1 = "reviewer1";
        const reviewData1 = [
            {req: 5, app: 10},
            {req: 20, app: 70},
            {req: 100, app: 250},
        ];
        const reviewData2 = [
            {req: 5, app: 30},
            {req: 40, app: 150},
        ];
        const reviewData3 = [{req: 5, app: 50}];
        const activities1 = [
            dc.createCommit(author1, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author1, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].app)),
            dc.createMerge(author1, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author1, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author1, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData2[0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData2[0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData2[1].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData2[1].app)),
            dc.createMerge(author1, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author1, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author1, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData3[0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData3[0].app)),
            dc.createMerge(author1, MOCK_MERGED_DATE),
        ];
        const requestedPRs = [
            dc.createPR({userId: author1}, activities1),
            dc.createPR({userId: author2}, activities2),
            dc.createPR({userId: author3}, activities3),
        ];

        // when
        const result = averageTimeToApproval(dc.createUser(reviewer1, {requestedPRs}));
        const mockTimesToApproval = [...reviewData1, ...reviewData2, ...reviewData3]
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockTimesToApproval));
    });

    // 리뷰 요청을 받지 않고 승인한 경우는 애초에 requestedPRs 에 포함되지 않으므로 고려하지 않는다.
});
