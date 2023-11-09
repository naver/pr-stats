/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import * as core from "@actions/core";
import * as github from "@actions/github";

import {throttling} from "@octokit/plugin-throttling";
import {initConfig} from "@/util";
import {defaultStats} from "./default-stats";

import type {IInternalConfig, TOctokit} from "@/types";

const printTime = (sec: number): string => {
    const seconds = Math.floor(sec % 60);
    const minutes = Math.floor(sec / 60);

    return `${minutes}m ${seconds}s`;
};

type TThrottlingOptions = Parameters<typeof throttling>[1];
interface ILimitHandlerOptions {
    method: string;
    url: string;
}

export class ActionContext {
    private static instance: ActionContext;

    static getInstance(): ActionContext {
        ActionContext.instance ??= new ActionContext();

        return ActionContext.instance;
    }
    private _inputString = {
        token: core.getInput("token", {required: true}),
        repository: core.getInput("repository", {required: true}),
        output: core.getInput("output"),
        ignoreUsers: core.getInput("ignoreUsers"),
        period: core.getInput("period"),
        count: core.getInput("count"),
        configPath: core.getInput("configPath"),
        baseBranch: core.getInput("baseBranch"),
    };
    private _apiRequestCount: number = 0;
    private _config: IInternalConfig;
    private _octokit: TOctokit = this._createOctokit();

    private constructor() {}

    async initialize(): Promise<void> {
        await this._initConfig();
    }

    increaseRequestCount() {
        this._apiRequestCount += 1;
    }

    get owner() {
        return this._input.owner;
    }

    get repo() {
        return this._input.repo;
    }

    get octokit() {
        return this._octokit;
    }

    get config() {
        return this._config;
    }

    get apiRequestCount() {
        return this._apiRequestCount;
    }

    private get _input() {
        const {token, repository, ignoreUsers, output, period, count, configPath, baseBranch} = this._inputString;
        const [start, end] = period.split("~");
        const [owner, repo] = repository.split("/");

        return {
            token,
            owner,
            repo,
            output: output.split(",").map(o => o.trim()),
            ignoreUsers: ignoreUsers.split(",").map(user => user.trim()),
            period: start ? ([new Date(start), end ? new Date(end) : new Date()] as const) : null,
            count: parseInt(count),
            configPath,
            baseBranch: baseBranch || undefined,
        };
    }

    private _createOctokit(): TOctokit {
        const {token} = this._input;
        const options: TThrottlingOptions = {
            throttle: {
                onRateLimit: (retryAfter, options: ILimitHandlerOptions, octokit) => {
                    octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

                    // 시간당 제한 요청 횟수 초과는 재시도하지 않음.
                    console.log(`You can retry after ${printTime(retryAfter)}`);
                },
                onSecondaryRateLimit: (retryAfter, options: ILimitHandlerOptions, octokit, retryCount) => {
                    octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);

                    if (retryCount < 3) {
                        console.log(`Retrying after ${printTime(retryAfter)}... Retrying ${retryCount} times...`);

                        return true;
                    }
                },
            },
        };
        // @ts-ignore
        return github.getOctokit(token, options, throttling);
    }

    private async _initConfig(): Promise<void> {
        const {output, configPath, ignoreUsers, period, count, baseBranch} = this._input;
        const config = await initConfig(configPath, defaultStats);

        this._config = {...config, output, ignoreUsers, period, count, baseBranch};
    }
}
