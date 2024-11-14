import Papa from "papaparse";

type TObject = Record<string, unknown>;

export const parseNumericFields = <T extends TObject>(array: T[]): T[] => {
    return array.map(data => {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                const parsable = typeof value === "string" && !isNaN(parseFloat(value));

                return [key, parsable ? parseFloat(value) : value];
            }),
        );
    }) as T[];
};

export const csvFileToObjectArray = <T extends TObject>(csv: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(csv, {
            complete: results => {
                if (!results.data.length) {
                    reject(new Error("The CSV file is empty."));
                    return;
                }

                const [header, ...rows] = results.data as string[][];

                if (!header || rows.length === 0) {
                    reject(new Error("The CSV file does not contain valid headers or data."));
                    return;
                }

                const object = rows.map(row =>
                    header.reduce((acc, key, i) => {
                        (acc as TObject)[key] = row[i];

                        return acc;
                    }, {} as T),
                );

                resolve(parseNumericFields(object));
            },
            error: error => {
                reject(error);
            },
            skipEmptyLines: true,
        });
    });
};

export const removeStringProps = (array: Record<string, unknown>[]): Record<string, number>[] => {
    if (!array.length) {
        return [];
    }

    const keys = Object.keys(array[0]);
    const stringKeys = keys.filter(key => array.every(obj => typeof obj[key] === "string"));

    return array.map(obj => {
        const result = {...obj};

        for (const key of stringKeys) {
            delete result[key];
        }

        return result as Record<string, number>;
    });
};
