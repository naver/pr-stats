/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {User} from "./user";

export abstract class Activity {
    protected _user: User;
    protected _createdAt: Date;

    constructor(userId: string, createdAt: Date | string) {
        this._user = User.create(userId);
        this._createdAt = new Date(createdAt);
    }

    get createdAt() {
        return this._createdAt;
    }

    get user() {
        return this._user;
    }
}
