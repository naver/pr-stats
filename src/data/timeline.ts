/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {Activity} from "./activity";
import {Comment, Approval} from "./comments";
import {ReviewRequest, Merge, Commit, Open} from "./events";
import type {User} from "./user";

export class Timeline {
    protected _activities: Activity[];

    constructor(activities: Activity[]) {
        this._activities = activities;
    }

    protected _getActivities<T extends abstract new (...args: any[]) => Activity>(activityType: T): InstanceType<T>[] {
        return this._activities.filter((activity): activity is InstanceType<T> => activity instanceof activityType);
    }

    get reviewRequests(): ReviewRequest[] {
        return this._getActivities(ReviewRequest);
    }

    get comments(): Comment[] {
        return this._getActivities(Comment);
    }

    get approvals(): Approval[] {
        return this._getActivities(Approval);
    }

    get conversations(): Comment[] {
        return this.comments.filter(c => c.body !== "");
    }

    get reviewers(): User[] {
        return [...new Set(this.reviewRequests.map(({user}) => user))];
    }

    get commits(): Commit[] {
        return this._getActivities(Commit);
    }

    get nonMergeCommits(): Commit[] {
        return this.commits.filter(({merged}) => !merged);
    }

    get firstRequestedAt(): Date | undefined {
        return this.reviewRequests[0]?.createdAt;
    }

    get createdAt(): Date {
        return this._activities.find(activity => activity instanceof Open)!.createdAt;
    }

    get mergedAt(): Date | undefined {
        return this._activities.find(activity => activity instanceof Merge)?.createdAt;
    }
}
