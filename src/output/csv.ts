/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import * as Papa from "papaparse";
import * as fs from "fs";
import type {IOutput} from "./";

const outputToJSON = (output: IOutput): Record<string, unknown> => {
    return Object.fromEntries(
        Object.entries(output).map(([key, data]) => {
            return [key, data.value];
        }),
    );
};
const DIR = "./stats";

export const csv = (output: IOutput | IOutput[], filename: string): void => {
    const outputs = Array.isArray(output) ? output : [output];
    const jsons = outputs.map(outputToJSON);
    const csvData = Papa.unparse(jsons);

    console.log("unParsing... make CSV Data. csv: " + csvData);
    console.log("starting... make CSV file. filename: " + filename);

    fs.mkdir(DIR, {recursive: true}, error => {
        if (error) {
            throw error;
        }

        fs.writeFile(`${DIR}/${filename}`, csvData, error => {
            if (error) {
                throw error;
            }

            console.log("CSV file is written successfully");
        });
    });
};
