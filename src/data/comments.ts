/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {IPRData} from "@/types";
import {COMMENT_ORIGIN, REVIEW_STATE, TCommentOrigin, TReviewState} from "@/const";
import {Activity} from "./activity";

interface ICommentInfo {
    userId: string;
    createdAt: Date | string;
    body: string;
}

interface IReviewInfo extends ICommentInfo {
    state: TReviewState;
}

export class Comment extends Activity {
    private _body: string;
    private _origin: string;

    constructor(origin: TCommentOrigin, {userId, createdAt, body}: ICommentInfo) {
        super(userId, createdAt);

        this._body = body;
        this._origin = origin;
    }

    get body() {
        return this._body;
    }

    get origin() {
        return this._origin;
    }
}

export class Review extends Comment {
    private _state: TReviewState;

    constructor(origin: TCommentOrigin, {userId, createdAt, body, state}: IReviewInfo) {
        super(origin, {userId, createdAt, body});

        this._state = state;
    }

    get state() {
        return this._state;
    }
}

export class Approval extends Review {}

export const comments = (data: IPRData): Comment[] => {
    const {reviews, comments: issueComments, reviewComments: codeComments} = data;

    const comments = [
        ...issueComments.map(
            ({user, body, created_at: createdAt}) =>
                new Comment(COMMENT_ORIGIN.ISSUE, {userId: user!.login, createdAt, body}),
        ),
        ...codeComments.map(
            ({user, body, created_at: createdAt}) =>
                new Comment(COMMENT_ORIGIN.CODE, {userId: user.login, createdAt, body}),
        ),
        ...reviews.map(({user, body, submitted_at: createdAt, state}) => {
            if (state === REVIEW_STATE.APPROVED) {
                return new Approval(COMMENT_ORIGIN.REVIEW, {userId: user.login, createdAt, body, state});
            }

            return new Review(COMMENT_ORIGIN.REVIEW, {userId: user.login, createdAt, body, state} as IReviewInfo);
        }),
    ].sort((c1, c2) => Number(c1.createdAt) - Number(c2.createdAt));

    return comments;
};
