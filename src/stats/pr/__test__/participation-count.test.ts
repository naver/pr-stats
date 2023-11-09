/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {participationCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("participationCount", () => {
    it("PR에서 리뷰 참여자(코멘트 혹은 승인을 남긴 사람) 수를 구할 수 있어야 한다.", () => {
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
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment2"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = participationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(3);
    });

    it("코멘트 혹은 승인에 내용이 없더라도 리뷰에 참여한 것으로 판단한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createComment(reviewer3, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 45)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = participationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(3);
    });

    it("코멘트 혹은 승인을 남기지 않았다면 리뷰에 참여하지 않았다고 판단한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3, reviewer4] = ["reviewer1", "reviewer2", "reviewer3", "reviewer4"];
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer4, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 10), {body: "comment1"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 30), {body: "comment2"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40), {body: "approve1"}),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = participationCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(1);
    });
});
