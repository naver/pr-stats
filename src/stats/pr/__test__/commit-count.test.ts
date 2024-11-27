/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {commitCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PR > commitCount", () => {
    it("PR에서 추가된 커밋 수를 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const reviewer1 = "reviewer1";
        const activities = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -50)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -40)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -10)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];

        // when
        const result = commitCount(dc.createPR({userId: author}, activities));

        // then
        expect(result.value).to.be.equal(5);
    });
});
