/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {User} from "./user";
import {type ReviewerInfo, reviewerInfos} from "./reviewers";
import {Timeline} from "./timeline";
import type {Activity} from "./activity";
import type {IPRInfo} from "@/types";

export class PR {
    private _author: User;
    private _number: number;
    private _title: string;
    private _merged: boolean;
    private _additions: number;
    private _deletions: number;
    private _changedFiles: number;
    private _timeline: Timeline;
    private _reviewerInfos: ReviewerInfo[];
    private _assignees: User[];

    constructor(prInfo: IPRInfo, activities: Activity[]) {
        const {number, title, merged, additions, deletions, changedFiles, userId, assigneeIds} = prInfo;

        this._author = User.create(userId);
        this._number = number;
        this._title = title;
        this._merged = merged;
        this._additions = additions;
        this._deletions = deletions;
        this._changedFiles = changedFiles;
        this._timeline = new Timeline(activities);

        const {reviewers} = this._timeline;

        this._reviewerInfos = reviewerInfos(reviewers, activities);
        this._assignees = assigneeIds.map(id => User.create(id));
    }

    get author(): User {
        return this._author;
    }

    get number(): number {
        return this._number;
    }

    get title(): string {
        return this._title;
    }

    get merged(): boolean {
        return this._merged;
    }

    get additions(): number {
        return this._additions;
    }

    get deletions(): number {
        return this._deletions;
    }

    get changedLineCount(): number {
        return this._additions + this._deletions;
    }

    get changedFiles(): number {
        return this._changedFiles;
    }

    get mergedAt(): Date {
        return this._timeline.mergedAt;
    }

    get createdAt(): Date {
        return this._timeline.createdAt;
    }

    get reviewerInfos(): ReviewerInfo[] {
        return this._reviewerInfos;
    }

    get assignees(): User[] {
        return this._assignees;
    }

    get timeline(): Timeline {
        return this._timeline;
    }
}
