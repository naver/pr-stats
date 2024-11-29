/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

export const msToHour = (duration: number): number => {
    return Math.floor(duration / (1000 * 60 * 60));
};
