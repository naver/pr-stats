/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageResponseTime} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

interface IReviewerResponseData {
    req: number;
    res: number | null;
}

describe("PRList > averageResponseTime", () => {
    it("특정 PR 목록에 대해 각 리뷰어에 대한 리뷰 요청 시점부터 해당 리뷰어의 첫 번째 응답(코멘트, 승인 등)까지 소요된 시간(ms)의 평균을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewsData1 = [
            [
                {req: 5, res: 10},
                {req: 20, res: 50},
                {req: 60, res: 100},
            ],
            [
                {req: 5, res: 10},
                {req: 30, res: 150},
            ],
            [{req: 5, res: 320}],
        ];
        const reviewsData2 = [
            [
                {req: 15, res: 30},
                {req: 40, res: 50},
                {req: 60, res: 100},
            ],
            [
                {req: 15, res: 40},
                {req: 50, res: 150},
            ],
        ];
        const reviewsData3 = [[{req: 25, res: 140}]];
        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].res)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].res)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].res)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageResponseTime([prStats1, prStats2, prStats3]);

        const mockResponseTimes = [...reviewsData1, ...reviewsData2, ...reviewsData3]
            .flat()
            .map(data => data.res - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockResponseTimes));
    });

    it("요청을 했지만 응답하지 않은 경우는 제외한 평균을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewsData1: IReviewerResponseData[][] = [
            [
                {req: 5, res: 10},
                {req: 20, res: 50},
                {req: 60, res: null},
            ],
            [
                {req: 5, res: 10},
                {req: 30, res: 150},
            ],
            [{req: 5, res: null}],
        ];
        const reviewsData2: IReviewerResponseData[][] = [
            [
                {req: 15, res: 30},
                {req: 40, res: 50},
                {req: 60, res: 100},
            ],
            [
                {req: 15, res: 40},
                {req: 50, res: null},
            ],
        ];
        const reviewsData3: IReviewerResponseData[][] = [[{req: 25, res: null}]];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].res)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].res)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].res)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].req)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageResponseTime([prStats1, prStats2, prStats3]);
        const mockResponseTimes = [...reviewsData1, ...reviewsData2, ...reviewsData3]
            .flat()
            .filter(data => !!data.res)
            .map(data => data.res - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockResponseTimes));
    });
});
