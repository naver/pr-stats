import {type RefObject, useEffect, useRef} from "react";
import * as Plot from "@observablehq/plot";
import {msToHour} from "../utils";

const format = (data: Record<string, number>[], label: {x: string; y: string}) => {
    return data.map(d => ({[label.x]: d[label.x], [label.y]: d[label.y]}));
};

export function useDensity<T extends HTMLElement>(
    data: Record<string, number>[],
    label: {x: string; y: string},
): RefObject<T> {
    const ref = useRef<T>(null);
    const formattedData = format(data, label);

    useEffect(() => {
        const den = Plot.plot({
            marginLeft: 50,
            inset: 50,
            color: {scheme: "YlGnBu"},
            x: {
                tickFormat: msToHour,
            },
            marks: [
                Plot.density(formattedData, {
                    x: label.x,
                    y: label.y,
                    bandwidth: 40,
                    thresholds: 20,
                    fill: "density",
                    clip: true,
                }),
            ],
        });

        const container = ref.current!;

        container.append(den);

        return () => {
            container.removeChild(den);
        };
    }, [formattedData, label]);

    return ref;
}
