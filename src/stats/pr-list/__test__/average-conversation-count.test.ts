/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageConversationCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PRList > averageConversationCount", () => {
    it("특정 PR 목록에서 PR당 대화 수의 평균을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 20), {body: "reviewer comment1"}),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 25), {body: "author comment1"}),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 40), {body: "reviewer comment2"}),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 45), {body: "author comment2"}),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 60), {body: "reviewer comment3"}),
            dc.createComment(reviewer1, addMinutes(MOCK_CREATED_DATE, 65)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 70)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 120)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 40), {body: "author comment1"}),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 350)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40), {body: "reviewer comment1"}),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prStats1 = createPRStats(dc.createPR({userId: author}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author}, activities3));

        // when
        const result = averageConversationCount([prStats1, prStats2, prStats3]);
        const conversationCount1 = 5;
        const conversationCount2 = 1;
        const conversationCount3 = 1;

        // then
        expect(result.value).to.be.equal((conversationCount1 + conversationCount2 + conversationCount3) / 3);
    });
});
