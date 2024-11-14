import {type RefObject, useEffect, useRef} from "react";
import * as Plot from "@observablehq/plot";
import {type TCorrelationMap, findMedian} from "../utils/stats";

export interface ICorrelation {
    x: string;
    y: string;
    correlation: number;
}

export const format = (correlationMap: TCorrelationMap): ICorrelation[] => {
    return Object.entries(correlationMap).flatMap(([x, row]) => {
        return [
            {x, y: x, correlation: 1},
            ...Object.entries(row).map(([y, correlation]) => {
                return {x, y, correlation};
            }),
        ];
    });
};

export function useCorrelation<T extends HTMLElement>(data: TCorrelationMap): RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        const correlations = format(data);

        const corr = Plot.plot({
            marginLeft: 100,
            height: 700,
            label: null,
            marginBottom: 200,
            x: {tickRotate: -90},
            color: {
                scheme: "BuRd",
                pivot: findMedian(correlations.map(({correlation}) => correlation)),
                legend: true,
                label: "correlation",
            },
            marks: [
                Plot.cell(correlations, {x: "x", y: "y", fill: "correlation"}),
                Plot.text(correlations, {
                    x: "x",
                    y: "y",
                    text: d => d.correlation.toFixed(2),
                    fill: d => (Math.abs(d.correlation) > 0.6 ? "white" : "black"),
                }),
                Plot.crosshair(correlations, {x: "x", y: "y", ruleStrokeWidth: 50, color: "blue"}),
            ],
        });

        const container = ref.current!;

        container.append(corr);

        return () => {
            container.removeChild(corr);
        };
    }, [data]);

    return ref;
}
