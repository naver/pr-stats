/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {DUMMY_PR_DATA} from "./dummy";
import {refinePR} from "../refine";
import {
    Activity,
    Approval,
    Comment,
    Commit,
    Merge,
    Open,
    ReviewRequest,
    comments as refineComments,
    events as refineEvents,
} from "@/data";
import {COMMENT_ORIGIN} from "@/const";

describe("refine >", () => {
    describe("refinePR", () => {
        it("PR 응답 데이터에서 필요한 정보만 추출할 수 있어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;

            // when
            const prInfo = refinePR(prData);

            // then
            const expectedPRInfo = {
                number: 2520,
                title: "feat(-): dummy PR title",
                userId: "user-1",
                merged: true,
                additions: 41,
                deletions: 35,
                changedFiles: 1,
                assigneeIds: ["user-1"],
            };
            expect(prInfo).to.be.deep.equal(expectedPRInfo);
        });
    });

    describe("refineComments", () => {
        it("코멘트 관련 데이터는 모두 Comment의 인스턴스로 생성되어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;
            const commentCount = 11;

            // when
            const comments = refineComments(prData);

            // then
            expect(comments.length).to.be.equal(commentCount);
            comments.forEach(comment => {
                expect(comment).to.be.instanceOf(Comment);
            });
        });

        it("코멘트 종류에 따라 알맞은 origin이 설정되어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;
            const issueCommentCount = 3;
            const codeCommentCount = 3;
            const reviewCount = 5;

            // when
            const comments = refineComments(prData);
            const issueComments = comments.filter(comment => comment.origin === COMMENT_ORIGIN.ISSUE);
            const codeComments = comments.filter(comment => comment.origin === COMMENT_ORIGIN.CODE);
            const reviews = comments.filter(comment => comment.origin === COMMENT_ORIGIN.REVIEW);

            // then
            expect(issueComments.length).to.be.equal(issueCommentCount);
            expect(codeComments.length).to.be.equal(codeCommentCount);
            expect(reviews.length).to.be.equal(reviewCount);
        });

        it("승인 코멘트는 Approval의 인스턴스로 생성되어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;
            const approvalCount = 2;

            // when
            const comments = refineComments(prData);
            const approvals = comments.filter(comment => comment instanceof Approval);

            // then
            expect(approvals.length).to.be.equal(approvalCount);
        });

        it("생성된 코멘트는 시간순으로 정렬되어 있어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;

            // when
            const comments = refineComments(prData);

            // then
            const sorted = comments.every((comment, index, arr) => {
                if (index === 0) return true;

                const prevTime = Number(arr[index - 1].createdAt);
                const currTime = Number(comment.createdAt);

                return currTime >= prevTime;
            });

            expect(sorted).to.be.true;
        });
    });

    describe("refineEvents", () => {
        it("이벤트 관련 데이터는 모두 Activity의 인스턴스로 생성되어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;

            // when
            const events = refineEvents(prData);

            // then
            events.forEach(event => {
                expect(event).to.be.instanceOf(Activity);
            });
        });

        it("이벤트 종류에 따라 알맞은 이벤트 인스턴스로 생성되어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;
            const reviewRequestCount = 3;
            const commitCount = 2;
            const openCount = 1;
            const mergeCount = 1;

            // when
            const events = refineEvents(prData);
            const reviewRequests = events.filter(event => event instanceof ReviewRequest);
            const commits = events.filter(event => event instanceof Commit);
            const opens = events.filter(event => event instanceof Open);
            const merges = events.filter(event => event instanceof Merge);

            // then
            expect(reviewRequests.length).to.be.equal(reviewRequestCount);
            expect(commits.length).to.be.equal(commitCount);
            expect(opens.length).to.be.equal(openCount);
            expect(merges.length).to.be.equal(mergeCount);
        });

        it("생성된 이벤트는 시간순으로 정렬되어 있어야 한다.", () => {
            // given
            const prData = DUMMY_PR_DATA;

            // when
            const events = refineEvents(prData);

            // then
            const sorted = events.every((event, index, arr) => {
                if (index === 0) return true;

                const prevTime = Number(arr[index - 1].createdAt);
                const currTime = Number(event.createdAt);

                return currTime >= prevTime;
            });

            expect(sorted).to.be.true;
        });
    });
});
