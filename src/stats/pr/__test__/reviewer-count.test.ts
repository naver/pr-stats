/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {reviewerCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PR > reviewerCount", () => {
    it("PR에서 요청받은 리뷰어 수를 구할 수 있어야 한다.", () => {
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
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = reviewerCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(4);
    });

    it("하나의 PR에서 동일한 리뷰어가 여러 번 요청받은 경우도 리뷰어 수는 동일해야 한다.", () => {
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
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 20)),
            dc.createComment(reviewer2, addMinutes(MOCK_CREATED_DATE, 30)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 50)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = reviewerCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(4);
    });
});
