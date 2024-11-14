"use client";

import {type ChangeEventHandler, useCallback, useState} from "react";
import {Correlation} from "./correlation";
import {Density} from "./density";
import {csvFileToObjectArray} from "./utils/csv";
import {type TCsvRow} from "./types";

const INPUT_NAMES = ["pr", "prList", "user"];

interface IInputProps {
    name: string;
    onUpload: (name: string, file: File) => void;
}

function Input({name, onUpload}: Readonly<IInputProps>) {
    const handleUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => {
            onUpload(name, e.target.files![0]);
        },
        [onUpload, name],
    );

    return (
        <div>
            <label htmlFor={name}>{name} file</label>
            <input id={name} type="file" onChange={handleUpload} />
        </div>
    );
}

interface ICsvData {
    pr: TCsvRow[];
    prList: TCsvRow[];
    user: TCsvRow[];
}

const USER_DENSITY_LABEL = {x: "averageResponseTime", y: "participationRate"};

export default function Home() {
    const [csvData, setCsvData] = useState<ICsvData>({pr: [], prList: [], user: []});
    const handleUpload = useCallback((name: string, file: File) => {
        csvFileToObjectArray<TCsvRow>(file).then(csvData => {
            setCsvData(prev => ({...prev, [name]: csvData}));
        });
    }, []);

    return (
        <>
            <h1>PR Stats</h1>
            {INPUT_NAMES.map(name => (
                <Input key={name} name={name} onUpload={handleUpload} />
            ))}
            {csvData.pr.length ? <Correlation data={csvData.pr} /> : null}
            {csvData.user.length ? <Density data={csvData.user} label={USER_DENSITY_LABEL} /> : null}
        </>
    );
}
