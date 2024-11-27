/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */
"use client";

import {createCorrelationMap} from "./utils/stats";
import {useCorrelation} from "./hooks/correlation";
import {removeStringProps} from "./utils/csv";
import {type TCsvRow} from "./types";

export function Correlation({data}: {data: TCsvRow[]}) {
    const ref = useCorrelation<HTMLDivElement>(createCorrelationMap(removeStringProps(data)));

    return <div ref={ref}></div>;
}
