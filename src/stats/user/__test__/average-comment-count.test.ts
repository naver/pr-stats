/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {averageCommentCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("User > averageCommentCount", () => {
    it("특정 리뷰어의 PR당 평균 코멘트 수를 구할 수 있어야 한다.", () => {
        // given
        const [author1, author2, author3] = ["author1", "author2", "author3"];
        const reviewer1 = "reviewer1";
        const activities1 = [
            dc.createCommit(author1, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author1, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment2"}),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60), {body: "comment3"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 100)),
            dc.createMerge(author1, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author2, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author2, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment2"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 50), {body: "comment3"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60), {body: ""}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createMerge(author2, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author3, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author3, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80), {body: "approval1"}),
            dc.createMerge(author3, MOCK_MERGED_DATE),
        ];
        const requestedPRs = [
            dc.createPR({userId: author1}, activities1),
            dc.createPR({userId: author2}, activities2),
            dc.createPR({userId: author3}, activities3),
        ];

        // when
        const result = averageCommentCount(dc.createUser(reviewer1, {requestedPRs}));
        const commentCount1 = 3;
        const commentCount2 = 3;
        const commentCount3 = 2;

        // then
        expect(result.value).to.be.equal((commentCount1 + commentCount2 + commentCount3) / 3);
    });
});
