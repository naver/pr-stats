/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc, numberHelper as num} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageTimeToApproval} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

interface IReviewerApprovalData {
    req: number;
    app: number | null;
}

describe("PRList > averageTimeToApproval", () => {
    it("특정 PR 목록에 대해 첫 리뷰 요청 후 승인까지 소요된 시간의 평균(ms)을 반환해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewsData1 = [[{req: 5, app: 80}], [{req: 5, app: 130}], [{req: 5, app: 250}]];
        const reviewsData2 = [[{req: 15, app: 50}], [{req: 15, app: 100}]];
        const reviewsData3 = [[{req: 25, app: 130}]];
        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].app)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 100)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].app)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].app)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageTimeToApproval([prStats1, prStats2, prStats3]);

        const mockTimesToApproval = [...reviewsData1, ...reviewsData2, ...reviewsData3]
            .flat()
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockTimesToApproval));
    });

    it("승인 후 재요청을 받은 경우, 리뷰어들의 각 승인 시점부터 `이전 승인(있다면) 이후의 첫 번째 리뷰 요청 시점` 사이에 소요된 시간의 평균(ms)을 반환해야 한다 ", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewsData1 = [
            [
                {req: 5, app: 60},
                {req: 80, app: 100},
                {req: 120, app: 150},
            ],
            [
                {req: 5, app: 70},
                {req: 90, app: 250},
            ],
            [{req: 5, app: 320}],
        ];
        const reviewsData2 = [
            [
                {req: 15, app: 60},
                {req: 80, app: 230},
                {req: 250, app: 300},
            ],
            [
                {req: 15, app: 90},
                {req: 200, app: 360},
            ],
        ];
        const reviewsData3 = [[{req: 25, app: 140}]];
        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].req)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].app)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].app)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].app)),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 250)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 270)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].app)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].req)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 260)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 280)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].app)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 110)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageTimeToApproval([prStats1, prStats2, prStats3]);

        const mockTimesToApproval = [...reviewsData1, ...reviewsData2, ...reviewsData3]
            .flat()
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockTimesToApproval));
    });

    it("리뷰 요청을 받지 않고 승인한 경우는 평균에서 제외되어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const reviewsData1: IReviewerApprovalData[][] = [
            [
                {req: 5, app: 60},
                {req: 80, app: 100},
                {req: 120, app: 150},
            ],
            [
                {req: 5, app: 70},
                {req: null, app: 250},
            ],
            [{req: null, app: 320}],
        ];
        const reviewsData2: IReviewerApprovalData[][] = [
            [
                {req: 15, app: 60},
                {req: 80, app: 230},
                {req: null, app: 300},
            ],
            [
                {req: 15, app: 90},
                {req: 200, app: 360},
            ],
        ];
        const reviewsData3: IReviewerApprovalData[][] = [[{req: null, app: 140}]];
        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].req)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][0].app)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][1].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData1[0][2].app)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData1[1][1].app)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, reviewsData1[2][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].req)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][0].app)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].req)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][0].app)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].req)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][1].app)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 260)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 280)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData2[0][2].app)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, reviewsData2[1][1].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, reviewsData3[0][0].app)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageTimeToApproval([prStats1, prStats2, prStats3]);

        const mockTimesToApproval = [...reviewsData1, ...reviewsData2, ...reviewsData3]
            .flat()
            .filter(data => !!data.req)
            .map(data => data.app - data.req)
            .map(min => num.minToMs(min));

        // then
        expect(result.value).to.be.equal(num.average(mockTimesToApproval));
    });
});
