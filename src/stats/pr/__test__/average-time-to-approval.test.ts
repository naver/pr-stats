/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {createPRStats} from "@/output";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

interface IReviewerApprovalData {
    req: number;
    app: number | null;
}

describe("PR > averageTimeToApproval", () => {
    it("첫 리뷰 요청 후 승인까지 소요된 시간의 평균(ms)을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewData1 = {req: 5, app: 250};
        const reviewData2 = {req: 2, app: 150};
        const reviewData3 = {req: 5, app: 60};
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1.req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2.req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3.req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3.app)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 120)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2.app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1.app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const prStats = createPRStats(dc.createPR({userId: author}, activities));
        const mockTimesToApproval = [reviewData1, reviewData2, reviewData3]
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(prStats.averageTimeToApproval.value).to.be.equal(num.average(mockTimesToApproval));
    });

    it("승인 후 재요청을 받은 경우, 리뷰어들의 각 승인 시점부터 `이전 승인(있다면) 이후의 첫 번째 리뷰 요청 시점` 사이에 소요된 시간의 평균(ms)을 반환해야 한다 ", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
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
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].app)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].req)),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 25)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].app)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].req)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        // when
        const prStats = createPRStats(dc.createPR({userId: author}, activities));
        const mockTimesToApproval = [...reviewData1, ...reviewData2, ...reviewData3]
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(prStats.averageTimeToApproval.value).to.be.equal(num.average(mockTimesToApproval));
    });

    it("리뷰 요청을 받지 않고 승인한 경우는 평균에서 제외되어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewData1: IReviewerApprovalData[] = [
            {req: 5, app: 10},
            {req: 20, app: 70},
            {req: 100, app: 250},
        ];
        const reviewData2: IReviewerApprovalData[] = [{req: null, app: 150}];
        const reviewData3: IReviewerApprovalData[] = [{req: null, app: 50}];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].req)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const prStats = createPRStats(dc.createPR({userId: author}, activities));
        const mockTimesToApproval = [...reviewData1, ...reviewData2, ...reviewData3]
            .filter(data => !!data.req)
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(prStats.averageTimeToApproval.value).to.be.equal(num.average(mockTimesToApproval));
    });
});
