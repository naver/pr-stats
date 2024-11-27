/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {conversationCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PR > conversationCount", () => {
    it("PR에서 오간 대화 수를 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 15), {body: "comment2"}),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 20), {body: "comment3"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment4"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = conversationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(4);
    });

    it("남긴 코멘트에 내용이 있는 경우(body가 비어 있지 않은 경우)만 대화라고 판단한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 15), {body: ""}),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 20), {body: "comment2"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment3"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = conversationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(3);
    });

    it("리뷰어가 승인을 하면서 남긴 글도 대화라고 판단한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 15), {body: ""}),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 20), {body: "comment2"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment3"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40), {body: "comment4"}),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45), {body: "comment5"}),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50), {body: "comment6"}),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = conversationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(6);
    });

    it("작성자가 남긴 코멘트도 카운트해야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 15), {body: "author comment1"}),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 20), {body: "comment2"}),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 25), {body: "comment3"}),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 30), {body: "author comment2"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 35), {body: "comment4"}),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 37), {body: "author comment3"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = conversationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(7);
    });
});
