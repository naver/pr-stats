/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {ReviewerInfo} from "@/data";
import {addMinutes, numberHelper as num, dummyCreator as dc} from "@/test-helper";

const TEST_DATE = new Date("2023-09-15T14:00:00Z");

describe("ReviewerInfo >", () => {
    describe("participated", () => {
        it("요청 받은 PR에 코멘트 혹은 승인이 하나라도 있는 경우 리뷰에 참여한 것으로 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.participated).to.be.true;
        });

        it("요청 받은 PR에 코멘트 혹은 승인이 하나도 없는 경우 리뷰에 참여하지 않은 것으로 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [dc.createReviewRequest(reviewerId, TEST_DATE)];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.participated).to.be.false;
        });
    });

    describe("finallyApproved", () => {
        it("마지막 리뷰 요청보다 마지막 승인 시점이 더 늦다면 최종 리뷰 상태가 승인이라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.finallyApproved).to.be.true;
        });

        it("마지막 리뷰 요청보다 마지막 승인 시점이 더 빠르다면 최종 리뷰 상태가 승인이 아니라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, 50)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.finallyApproved).to.be.false;
        });

        it("리뷰 요청이 없이 승인만 한 경우는 최종 리뷰 상태가 승인이 아니라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40))];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.finallyApproved).to.be.false;
        });

        it("리뷰 요청만 있고 승인이 없는 경우는 최종 리뷰 상태가 승인이 아니라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [dc.createReviewRequest(reviewerId, TEST_DATE)];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.finallyApproved).to.be.false;
        });
    });

    describe("commentCount", () => {
        it("요청 받은 PR에 남긴 코멘트의 수를 구할 수 있어야 한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10), {body: "comment1"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20), {body: "comment2"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 30), {body: "comment3"}),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.commentCount).to.be.equal(3);
        });

        it("실제로 대화를 남긴 경우(body가 비어 있지 않은 경우)만 코멘트라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10), {body: "comment1"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20), {body: "comment2"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 30), {body: ""}),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.commentCount).to.be.equal(2);
        });

        it("승인을 하면서 대화를 남긴 경우도 코멘트라고 판단한다.", () => {
            // given
            const reviewerId = "user1";
            const activities = [
                dc.createReviewRequest(reviewerId, TEST_DATE),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 10), {body: "comment1"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 20), {body: "comment2"}),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, 30), {body: ""}),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, 40), {body: "approve1"}),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.commentCount).to.be.equal(3);
        });
    });

    describe("responseTimes", () => {
        it("각 리뷰 요청 시점부터 첫 번째 응답(코멘트, 승인 등)까지 소요된 시간(ms)의 배열을 반환해야 한다.", () => {
            // given
            const reviewerId = "user1";
            const [r1, c1, r2, c2, r3, a1] = [0, 10, 30, 50, 60, 80];

            const activities = [
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r1)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c1)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r2)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c2)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r3)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, a1)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.responseTimes).to.be.eql([
                num.minToMs(c1 - r1),
                num.minToMs(c2 - r2),
                num.minToMs(a1 - r3),
            ]);
        });

        it("리뷰 요청을 했지만 응답을 하지 않은 경우는 null로 표현한다.", () => {
            // given
            const reviewerId = "user1";
            const [r1, c1, r2] = [0, 10, 30];

            const activities = [
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r1)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c1)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r2)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.responseTimes).to.be.eql([num.minToMs(c1 - r1), null]);
        });
    });

    describe("timesToApprovals", () => {
        it("첫 리뷰 요청 후 승인까지 소요된 시간(ms)의 배열을 반환해야 한다.", () => {
            // given
            const reviewerId = "user1";
            const [r1, c1, r2, c2, a1] = [0, 10, 30, 50, 70];

            const activities = [
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r1)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c1)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r2)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c2)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, a1)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.timesToApprovals).to.be.eql([num.minToMs(a1 - r1)]);
        });

        it("승인 후 재요청을 받은 경우, 각 승인 시점부터 `이전 승인 이후의 첫 번째 리뷰 요청 시점` 사이에 소요된 시간(ms)의 배열을 반환해야 한다.", () => {
            // given
            const reviewerId = "user1";
            const [r1, a1, r2, c1, a2] = [0, 10, 30, 50, 70];

            const activities = [
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r1)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, a1)),
                dc.createReviewRequest(reviewerId, addMinutes(TEST_DATE, r2)),
                dc.createComment(reviewerId, addMinutes(TEST_DATE, c1)),
                dc.createApproval(reviewerId, addMinutes(TEST_DATE, a2)),
            ];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.timesToApprovals).to.be.eql([num.minToMs(a1 - r1), num.minToMs(a2 - r2)]);
        });

        it("요청을 받지 않고 승인만 한 경우는 null로 표현한다.", () => {
            // given
            const reviewerId = "user1";

            const activities = [dc.createApproval(reviewerId, addMinutes(TEST_DATE, 50))];

            // when
            const reviewerInfo = new ReviewerInfo(reviewerId, activities);

            // then
            expect(reviewerInfo.timesToApprovals).to.be.eql([null]);
        });
    });
});
