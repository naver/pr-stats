/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageChangedLineCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PRList > averageChangedLineCount", () => {
    it("특정 PR 목록에서 PR당 변경된 라인 수의 평균을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -10)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 120)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20), {parents: [{}, {}]}),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 350)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const mockChanges1 = {
            additions: 150,
            deletions: 200,
        };
        const mockChanges2 = {
            additions: 26,
            deletions: 0,
        };
        const mockChanges3 = {
            additions: 79,
            deletions: 43,
        };
        const prStats1 = createPRStats(dc.createPR({userId: author, ...mockChanges1}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author, ...mockChanges2}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author, ...mockChanges3}, activities3));

        // when
        const result = averageChangedLineCount([prStats1, prStats2, prStats3]);
        const mockChangedLineCount1 = mockChanges1.additions + mockChanges1.deletions;
        const mockChangedLineCount2 = mockChanges2.additions + mockChanges2.deletions;
        const mockChangedLineCount3 = mockChanges3.additions + mockChanges3.deletions;

        // then
        expect(result.value).to.be.equal((mockChangedLineCount1 + mockChangedLineCount2 + mockChangedLineCount3) / 3);
    });
});
