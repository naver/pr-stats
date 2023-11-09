/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {defaultPRCalculator as pr, defaultUserCalculator as user, defaultPRListCalculator as prList} from "@/stats";
import type {IDefaultStats} from "@/types";

export const defaultStats: IDefaultStats = {
    pr: [
        ["number", pr.number],
        ["title", pr.title],
        ["addedLineCount", pr.addedLineCount],
        ["removedLineCount", pr.removedLineCount],
        ["changedLineCount", pr.changedLineCount],
        ["fileCount", pr.fileCount],
        ["commitCount", pr.commitCount],
        ["commentCount", pr.commentCount],
        ["conversationCount", pr.conversationCount],
        ["reviewerCount", pr.reviewerCount],
        ["approvalCount", pr.approvalCount],
        ["participationCount", pr.participationCount],
        ["timeFromReviewToMerge", pr.timeFromReviewToMerge],
        ["averageResponseTime", pr.averageResponseTime],
        ["averageTimeToApproval", pr.averageTimeToApproval],
        ["averageLinesChangedPerCommit", pr.averageLinesChangedPerCommit],
    ],
    prList: [
        ["averageAddedLineCount", prList.averageAddedLineCount],
        ["averageRemovedLineCount", prList.averageRemovedLineCount],
        ["averageChangedLineCount", prList.averageChangedLineCount],
        ["averageFileCount", prList.averageFileCount],
        ["averageCommitCount", prList.averageCommitCount],
        ["averageCommentCount", prList.averageCommentCount],
        ["averageConversationCount", prList.averageConversationCount],
        ["averageReviewerCount", prList.averageReviewerCount],
        ["averageApprovalCount", prList.averageApprovalCount],
        ["averageParticipationCount", prList.averageParticipationCount],
        ["averageTimeFromReviewToMerge", prList.averageTimeFromReviewToMerge],
        ["averageResponseTime", prList.averageResponseTime],
        ["averageTimeToApproval", prList.averageTimeToApproval],
        ["averageLinesChangedPerCommit", prList.averageLinesChangedPerCommit],
    ],
    user: [
        ["id", user.id],
        ["requestedCount", user.requestedCount],
        ["participationCount", user.participationCount],
        ["participationRate", user.participationRate],
        ["averageCommentCount", user.averageCommentCount],
        ["averageResponseTime", user.averageResponseTime],
        ["averageTimeToApproval", user.averageTimeToApproval],
        ["averageLinesChangedPerCommit", user.averageLinesChangedPerCommit],
    ],
} as const;
