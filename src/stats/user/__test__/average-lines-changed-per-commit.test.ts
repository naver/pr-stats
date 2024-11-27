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

describe("User > averageLinesChangedPerCommit", () => {
    it("특정 유저의 모든 PR에 대해 커밋당 평균 변경 라인 수를 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const reviewer1 = "reviewer1";

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -50)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -40)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -10)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -5), {parents: [{}, {}]}),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -1), {parents: [{}, {}]}),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -50)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -1), {parents: [{}, {}]}),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -50)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const mockChanges1 = {additions: 321, deletions: 252};
        const mockChanges2 = {additions: 50, deletions: 100};
        const mockChanges3 = {additions: 26, deletions: 0};

        const assignedPRs = [
            dc.createPR({userId: author, ...mockChanges1}, activities1),
            dc.createPR({userId: author, ...mockChanges2}, activities2),
            dc.createPR({userId: author, ...mockChanges3}, activities3),
        ];

        // when
        const result = averageLinesChangedPerCommit(dc.createUser(reviewer1, {assignedPRs}));

        // then
        const totalChangedLineCount = [mockChanges1, mockChanges2, mockChanges3]
            .map(({additions, deletions}) => additions + deletions)
            .reduce((acc, cur) => acc + cur, 0);
        const totalNonMergeCommitCount = 8;

        expect(result.value).to.be.equal(totalChangedLineCount / totalNonMergeCommitCount);
    });
});
