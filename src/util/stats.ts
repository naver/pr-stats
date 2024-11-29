/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

export const average = (arr: number[]): number =>
    arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;
