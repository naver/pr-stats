/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {participationRate} from "../";
import {createPRStats} from "@/output";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("participationRate", () => {
    it("PR에서 리뷰 참여율을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 70)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 150)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 250)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = participationRate([prStats1, prStats2, prStats3]);

        // then
        expect(result.value).to.be.equal(100);
    });

    it("PR에서 리뷰 참여율을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 70)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = participationRate([prStats1, prStats2, prStats3]);
        const reviewerCount1 = 3;
        const reviewerCount2 = 2;
        const reviewerCount3 = 1;
        const participationCount1 = 2;
        const participationCount2 = 1;
        const participationCount3 = 1;

        // then
        expect(result.value).to.be.equal(
            ((participationCount1 + participationCount2 + participationCount3) /
                (reviewerCount1 + reviewerCount2 + reviewerCount3)) *
                100,
        );
    });
});
