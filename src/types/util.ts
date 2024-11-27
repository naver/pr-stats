/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

/**
 * 객체의 값 타입들의 유니온 타입을 반환
 *
 * const TYPE = {
 *     P1: "p1",
 *     P2: "p2"
 * } as const;
 *
 * TValues<typeof TYPE> // "p1" | "p2"
 */

export type TValues<T extends object> = T extends readonly any[] ? T[number] : T[keyof T];

type TPrimitive = string | number | boolean | symbol | bigint | undefined | null;

export type TDeepPartial<T> = {
    [P in keyof T]?: T[P] extends TPrimitive | ((...args: any[]) => any) ? T[P] : TDeepPartial<T[P]>;
};
