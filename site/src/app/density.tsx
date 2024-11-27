/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

"use client";

import {useDensity} from "./hooks/density";
import {type TCsvRow} from "./types";
import {removeStringProps} from "./utils/csv";

export function Density({data, label}: {data: TCsvRow[]; label: {x: string; y: string}}) {
    const ref = useDensity<HTMLDivElement>(removeStringProps(data), label);

    return <div ref={ref}></div>;
}
