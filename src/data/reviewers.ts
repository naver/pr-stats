/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {Activity} from "./activity";
import {Timeline} from "./timeline";
import {User} from "./user";

export class ReviewerInfo {
    private _user: User;
    private _timeline: Timeline;

    constructor(userId: string, activities: Activity[]) {
        this._user = User.create(userId);
        this._timeline = new Timeline(activities);
    }

    get user() {
        return this._user;
    }

    get commentCount(): number {
        return this._timeline.conversations.length;
    }

    get responseTimes(): (number | null)[] {
        const {comments, reviewRequests} = this._timeline;

        return reviewRequests.map(reviewRequest => {
            const firstCommentAfterRequest = comments.find(c => c.createdAt > reviewRequest.createdAt);

            return Number(firstCommentAfterRequest?.createdAt) - Number(reviewRequest.createdAt) || null;
        });
    }

    get timesToApprovals(): (number | null)[] {
        const {reviewRequests, approvals} = this._timeline;

        return approvals.map((approval, index, approvals) => {
            const prevApprovalTime = approvals[index - 1]?.createdAt ?? 0;
            const firstRequestAfterPrevApproval = reviewRequests.find(req => req.createdAt > prevApprovalTime);

            return Number(approval.createdAt) - Number(firstRequestAfterPrevApproval?.createdAt) || null;
        });
    }

    get participated(): boolean {
        return this._timeline.comments.length >= 1;
    }

    get finallyApproved(): boolean {
        const {reviewRequests, approvals} = this._timeline;
        const lastApproval = approvals.at(-1);
        const lastRequest = reviewRequests.at(-1);

        if (!(lastApproval && lastRequest)) {
            return false;
        }

        return lastRequest.createdAt < lastApproval.createdAt;
    }
}

export const reviewerInfos = (reviewers: User[], activities: Activity[]): ReviewerInfo[] => {
    return reviewers.map(reviewer => {
        const userActivities = activities.filter(activity => activity.user.id === reviewer.id);

        return new ReviewerInfo(reviewer.id, userActivities);
    });
};
