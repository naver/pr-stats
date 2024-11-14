"use client";

import {useDensity} from "./hooks/density";
import {type TCsvRow} from "./types";
import {removeStringProps} from "./utils/csv";

export function Density({data, label}: {data: TCsvRow[]; label: {x: string; y: string}}) {
    const ref = useDensity<HTMLDivElement>(removeStringProps(data), label);

    return <div ref={ref}></div>;
}
