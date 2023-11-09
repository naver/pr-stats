/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageLinesChangedPerCommit} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("averageLinesChangedPerCommit", () => {
    it("특정 PR 목록에 대해 커밋당 평균 변경 라인 수를 반환해야 한다. 이때, 전체 변경 라인 수를 merge 커밋이 아닌 커밋의 수로 나누어 계산한다.", () => {
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
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -1), {parents: [{}, {}]}),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const prInfo1 = {
            userId: author,
            additions: 321,
            deletions: 252,
        };
        const prInfo2 = {
            userId: author,
            additions: 72,
            deletions: 44,
        };
        const prInfo3 = {
            userId: author,
            additions: 0,
            deletions: 21,
        };

        const prStats1 = createPRStats(dc.createPR(prInfo1, activities1));
        const prStats2 = createPRStats(dc.createPR(prInfo2, activities2));
        const prStats3 = createPRStats(dc.createPR(prInfo3, activities3));

        // when
        const result = averageLinesChangedPerCommit([prStats1, prStats2, prStats3]);
        const totalChangedLineCount = [prInfo1, prInfo2, prInfo3]
            .map(({additions, deletions}) => additions + deletions)
            .reduce((acc, cur) => acc + cur, 0);
        const totalNonMergeCommitCount = 8;

        // then
        expect(result.value).to.be.equal(totalChangedLineCount / totalNonMergeCommitCount);
    });
});
