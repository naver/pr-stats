/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {ActionContext} from "@/context";
import type {IOutput} from "./";

export const log = (output: IOutput | IOutput[], title?: string): void => {
    const outputs = Array.isArray(output) ? output : [output];
    title && console.log(`***** ***** ${title} ***** *****`);

    outputs.forEach(output => {
        Object.keys(output).forEach(key => {
            console.log(output[key].message);
        });

        console.log("***** ***** ***** ***** *****");
    });
};

export const logAPIRequestCount = (): void => {
    console.log(`Number of API requests: ${ActionContext.getInstance().apiRequestCount}`);
};
