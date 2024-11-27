/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {ActionContext} from "@/context";
import type {PR} from "./pr";
import type {ReviewerInfo} from "./reviewers";

export class User {
    static _users: Record<string, User> = {};
    static create(id: string): User {
        const user = User._users[id];

        if (user) {
            return user;
        }

        return (User._users[id] = new User(id));
    }
    static get allUsers(): User[] {
        return Object.values(this._users).filter(
            ({id}) => !ActionContext.getInstance().config.ignoreUsers.includes(id),
        );
    }

    private _id: string;

    private _requestedPRs: PR[] = [];
    private _assignedPRs: PR[] = [];

    constructor(id: string) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    addRequestedPR(pr: PR): void {
        this._requestedPRs.push(pr);
    }

    addAssignedPR(pr: PR): void {
        this._assignedPRs.push(pr);
    }

    get requestedPRs() {
        return this._requestedPRs;
    }

    get assignedPRs() {
        return this._assignedPRs;
    }

    get reviewInfos(): ReviewerInfo[] {
        return this._requestedPRs.map(pr => pr.reviewerInfos.find(info => info.user.id === this._id));
    }
}
