/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {averageResponseTime} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

interface IReviewerResponseData {
    req: number;
    res: number | null;
}

describe("PR > averageResponseTime", () => {
    it("각 리뷰어에 대한 리뷰 요청 시점부터 해당 리뷰어의 첫 번째 응답(코멘트, 승인 등)까지 소요된 시간(ms)의 평균을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewData1 = [
            {req: 5, res: 10},
            {req: 20, res: 50},
            {req: 60, res: 100},
        ];
        const reviewData2 = [
            {req: 5, res: 10},
            {req: 30, res: 150},
        ];
        const reviewData3 = [{req: 5, res: 320}];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].res)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].res)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = averageResponseTime(dc.createPR({userId: author}, activities));
        const mockResponseTimes = [...reviewData1, ...reviewData2, ...reviewData3]
            .map(data => data.res - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockResponseTimes));
    });

    it("요청을 했지만 응답하지 않은 경우는 제외한 평균을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewData1: IReviewerResponseData[] = [
            {req: 5, res: 10},
            {req: 20, res: 50},
            {req: 60, res: null},
        ];
        const reviewData2: IReviewerResponseData[] = [
            {req: 5, res: 10},
            {req: 30, res: 150},
        ];
        const reviewData3: IReviewerResponseData[] = [{req: 5, res: null}];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewData3[0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewData1[2].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewData2[1].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = averageResponseTime(dc.createPR({userId: author}, activities));
        const mockResponseTimes = [...reviewData1, ...reviewData2, ...reviewData3]
            .filter(data => !!data.res)
            .map(data => data.res - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockResponseTimes));
    });
});
