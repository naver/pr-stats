/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {ActionContext} from "@/context";
import {OUTPUT_METHOD, type TOutputMethod} from "@/const";
import type {IResult, TStatsType} from "@/types";
import {log, logAPIRequestCount} from "./console";
import {csv} from "./csv";

export interface IOutput {
    [key: string]: IResult;
}

export const statsToOutput = (stats: Record<string, any>, targets: readonly string[]): IOutput => {
    return targets.reduce<IOutput>((output, key) => {
        output[key] = stats[key] as IResult;

        return output;
    }, {});
};

const outputHandler = {
    [OUTPUT_METHOD.CONSOLE]: (output: Record<TStatsType, IOutput[]>) => {
        Object.entries(output).forEach(([name, o]) => log(o, `${name} stats`));
    },
    [OUTPUT_METHOD.CSV]: (output: Record<TStatsType, IOutput[]>) => {
        Object.entries(output).forEach(([name, o]) => csv(o, `${name}.csv`));
    },
};

const printOutput = (output: Record<TStatsType, IOutput[]>, method: TOutputMethod | readonly TOutputMethod[]) => {
    const methods = Array.isArray(method) ? method : [method];

    methods.forEach(method => outputHandler[method](output));
};

const printActionInfo = () => {
    logAPIRequestCount();
};

export const print = (output: Record<TStatsType, IOutput[]>): void => {
    const {output: method} = ActionContext.getInstance().config;

    printOutput(output, method);
    printActionInfo();
};

export * from "./csv";
export * from "./console";
export * from "./stats";
