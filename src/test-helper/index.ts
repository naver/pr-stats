/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {COMMENT_ORIGIN, REVIEW_STATE} from "@/const";
import {type IPRInfo} from "@/types";
import {Approval, Comment, Review, Commit, Merge, ReviewRequest, PR, Activity, Open, User} from "@/data";

type TDummyPRInfo = Partial<IPRInfo>;

let dummyNum = 0;
export const dummyCreator = {
    createReviewRequest(userId: string, createdAt: Date | string): ReviewRequest {
        return new ReviewRequest({userId, createdAt});
    },
    createMerge(userId: string, createdAt: Date | string): Merge {
        return new Merge({userId, createdAt});
    },
    createOpen(userId: string, createdAt: Date | string): Open {
        return new Open({userId, createdAt});
    },
    createCommit(userId: string, createdAt: Date | string, {parents = [{}], message = "", sha = ""} = {}): Commit {
        return new Commit({userId, createdAt, message, parents, sha});
    },
    createComment(userId: string, createdAt: Date | string, {origin = COMMENT_ORIGIN.CODE, body = ""} = {}): Comment {
        return new Comment(origin, {userId, createdAt, body});
    },
    createReview(userId: string, createdAt: Date | string, {body = "", state = REVIEW_STATE.COMMENTED} = {}): Review {
        return new Review(COMMENT_ORIGIN.REVIEW, {userId, createdAt, body, state});
    },
    createApproval(userId: string, createdAt: Date | string, {body = ""} = {}): Approval {
        return new Approval(COMMENT_ORIGIN.REVIEW, {userId, createdAt, body, state: REVIEW_STATE.APPROVED});
    },
    createPR(
        {
            number = ++dummyNum,
            title = `feat(-): pr dummy title ${number}`,
            merged = true,
            additions = 10,
            deletions = 10,
            changedFiles = 2,
            userId = "author1",
            assigneeIds = [userId],
        }: TDummyPRInfo,
        activities: Activity[] = [],
    ): PR {
        return new PR(
            {
                number,
                title,
                merged,
                additions,
                deletions,
                changedFiles,
                userId,
                assigneeIds,
            },
            activities,
        );
    },
    createUser(id: string, {assignedPRs = [], requestedPRs = []}) {
        const user = new User(id);

        assignedPRs.forEach(pr => user.addAssignedPR(pr));
        requestedPRs.forEach(pr => user.addRequestedPR(pr));

        return user;
    },
};

export const addMinutes = (date: Date, min: number): Date => {
    const newDate = new Date(date);

    newDate.setMinutes(date.getMinutes() + min);

    return newDate;
};

const MIN_IN_MS = 60000;

export const numberHelper = {
    minToMs: (min: number) => min * MIN_IN_MS,
    average: (arr: number[]): number => (arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0),
};
