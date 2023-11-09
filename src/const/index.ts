/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {TValues} from "@/types";

export const COMMENT_ORIGIN = {
    REVIEW: "review",
    CODE: "code",
    ISSUE: "issue",
} as const;
export type TCommentOrigin = TValues<typeof COMMENT_ORIGIN>;
export const EVENT_TYPE = {
    REVIEW_REQUESTED: "review_requested",
    MERGED: "merged",
    COMMENTED: "commented",
    REVIEWED: "reviewed",
    COMMITTED: "committed",
    OPENED: "opened", // custom added
} as const;
export type TEventType = TValues<typeof EVENT_TYPE>;

export const REVIEW_STATE = {
    APPROVED: "APPROVED",
    COMMENTED: "COMMENTED",
    CHANGES_REQUESTED: "CHANGES_REQUESTED",
} as const;
export type TReviewState = TValues<typeof REVIEW_STATE>;

export const OUTPUT_METHOD = {
    CONSOLE: "console",
    CSV: "csv",
};
export type TOutputMethod = TValues<typeof OUTPUT_METHOD>;
