/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

const msToTime = (
    duration: number,
): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} => {
    if (!duration) {
        return {
            days: -1,
            hours: -1,
            minutes: -1,
            seconds: -1,
        };
    }

    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    return {
        days,
        hours,
        minutes,
        seconds,
    };
};

export const printTime = (duration: number): string => {
    const {days, hours, minutes} = msToTime(duration);

    return `${days}d ${hours}h ${minutes}m`;
};
