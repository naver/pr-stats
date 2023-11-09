/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {changedLineCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PR > changedLineCount", () => {
    it("PR에서 변경된 전체 라인 수를 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const reviewer1 = "reviewer1";
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const mockAdditions = 150;
        const mockDeletions = 200;

        // when
        const result = changedLineCount(
            dc.createPR({userId: author, additions: mockAdditions, deletions: mockDeletions}, activities),
        );

        // then
        expect(result.value).to.be.equal(mockAdditions + mockDeletions);
    });
});
