/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {IPRData, TEventData, TValues} from "@/types";
import {EVENT_TYPE} from "@/const";
import {Activity} from "./activity";

const USING_EVENT = [EVENT_TYPE.REVIEW_REQUESTED, EVENT_TYPE.MERGED, EVENT_TYPE.COMMITTED, EVENT_TYPE.OPENED];

interface IEventInfo {
    userId: string;
    createdAt: Date | string;
}

interface ICommitInfo extends IEventInfo {
    message: string;
    parents: object[];
    sha: string;
}

export class ReviewRequest extends Activity {
    constructor({userId, createdAt}: IEventInfo) {
        super(userId, createdAt);
    }
}

export class Merge extends Activity {
    constructor({userId, createdAt}: IEventInfo) {
        super(userId, createdAt);
    }
}

export class Open extends Activity {
    constructor({userId, createdAt}: IEventInfo) {
        super(userId, createdAt);
    }
}

export class Commit extends Activity {
    private _message: string;
    private _parents: object[];
    private _sha: string;

    constructor({userId, createdAt, message, parents, sha}: ICommitInfo) {
        super(userId, createdAt);

        this._message = message;
        this._parents = parents;
        this._sha = sha;
    }

    get message() {
        return this._message;
    }

    get sha() {
        return this._sha;
    }

    get merged(): boolean {
        return this._parents.length > 1 || this._message.startsWith("Merge ");
    }
}

type TEvent = ReviewRequest | Merge | Commit | Open;

const createEvent = (data: TEventData): TEvent | null => {
    switch (data.event) {
        case EVENT_TYPE.REVIEW_REQUESTED: {
            if (!data.requested_reviewer) {
                // todo requested_team 대응
                return null;
            }

            const {
                requested_reviewer: {login: userId},
                created_at: createdAt,
            } = data;
            return new ReviewRequest({userId, createdAt});
        }
        case EVENT_TYPE.MERGED: {
            const {
                actor: {login: userId},
                created_at: createdAt,
            } = data;
            return new Merge({userId, createdAt});
        }
        case EVENT_TYPE.COMMITTED: {
            const {committer, message, parents, sha} = data;
            const {name: userId, date: createdAt} = committer;

            return new Commit({userId, createdAt, message, parents, sha});
        }
        case EVENT_TYPE.OPENED: {
            const {
                created_at: createdAt,
                user: {login: userId},
            } = data;

            return new Open({createdAt, userId});
        }
        default:
            return null;
    }
};
export const events = ({events: eventData, pr: {created_at, user}}: IPRData): TEvent[] => {
    const usingEvents = eventData.filter(({event}) => USING_EVENT.includes(event as TValues<typeof USING_EVENT>));
    const openEventData = {event: EVENT_TYPE.OPENED, created_at, user};

    return [openEventData, ...usingEvents]
        .map(e => createEvent(e))
        .filter(Boolean)
        .sort((e1, e2) => Number(e1.createdAt) - Number(e2.createdAt));
};
