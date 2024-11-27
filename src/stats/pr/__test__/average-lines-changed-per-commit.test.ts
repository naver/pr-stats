/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {averageLinesChangedPerCommit} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PR > averageLinesChangedPerCommit", () => {
    it("PR의 커밋당 평균 변경 라인 수는 전체 변경 라인 수를 merge 커밋이 아닌 커밋의 수로 나누어 구한다.", () => {
        // given
        const author = "author1";
        const reviewer1 = "reviewer1";
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -50)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -40)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -10)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -5), {parents: [{}, {}]}),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -1), {parents: [{}, {}]}),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const mockAdditions = 321;
        const mockDeletions = 252;

        // when
        const result = averageLinesChangedPerCommit(
            dc.createPR({userId: author, additions: mockAdditions, deletions: mockDeletions}, activities),
        );

        // then
        expect(result.value).to.be.equal((mockAdditions + mockDeletions) / 5);
    });
});
