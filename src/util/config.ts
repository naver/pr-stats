/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import type {IStats, IDefaultStats, IMergedStats, IRefinedConfig, TCalculator, TDeepPartial, TStatsType} from "@/types";
import fs from "fs";
import path from "path";

type TExternalStats = TDeepPartial<IStats>;

const mergeStats = (defaultStats: IDefaultStats, externalStats: TExternalStats): IMergedStats => {
    if (!externalStats || !Object.keys(externalStats).length) {
        return defaultStats;
    }

    return Object.fromEntries(
        Object.entries(externalStats).map(([type, statsList]: [TStatsType, (string | [string, TCalculator])[]]) => {
            return [
                type,
                statsList
                    .map(stats => {
                        if (Array.isArray(stats) && typeof stats[1] === "function") {
                            return stats;
                        }

                        return (
                            defaultStats[type].find(([name]) => name === (Array.isArray(stats) ? stats[0] : stats)) ??
                            null
                        );
                    })
                    .filter(Boolean),
            ];
        }),
    ) as unknown as IMergedStats;
};

type TConfigFunction = {default: (config: IDefaultStats) => TExternalStats};

const isConfigFunction = (config: TExternalStats | TConfigFunction): config is TConfigFunction => {
    return typeof (config as TConfigFunction).default === "function";
};

const loadConfig = async (configPath: string, defaultStats: IDefaultStats): Promise<TExternalStats | null> => {
    const currentPath = path.join(process.cwd(), configPath);

    if (fs.existsSync(currentPath)) {
        const config: (TExternalStats & {default: TExternalStats}) | TConfigFunction = await import(currentPath);

        return isConfigFunction(config) ? config.default(defaultStats) : config.default;
    } else {
        console.error("The 'stats.config.js' file was not found.");

        return null;
    }
};

export const initConfig = async (configPath: string, defaultStats: IDefaultStats): Promise<IRefinedConfig> => {
    const externalStats = await loadConfig(configPath, defaultStats);

    const mergedStats = externalStats ? mergeStats(defaultStats, externalStats) : defaultStats;

    return refineConfig(mergedStats, defaultStats);
};

const extractStats = (stats: IMergedStats): IRefinedConfig["stats"] => {
    return Object.fromEntries(
        Object.entries(stats).map(([type, statsList]: [TStatsType, [string, TCalculator][]]) => [
            type,
            statsList.map(([name]) => name),
        ]),
    ) as unknown as IRefinedConfig["stats"];
};

const extractCalculator = (stats: IMergedStats): IRefinedConfig["calculator"] => {
    return Object.fromEntries(
        Object.entries(stats).map(([type, statsList]: [TStatsType, [string, TCalculator][]]) => {
            return [type, Object.fromEntries(statsList)];
        }),
    ) as IRefinedConfig["calculator"];
};

const mergeCalculator = (calculator: IRefinedConfig["calculator"], defaultCalculator: IRefinedConfig["calculator"]) => {
    return {
        ...defaultCalculator,
        ...Object.fromEntries(
            Object.entries(calculator).map(([type, calc]) => {
                return [type, {...defaultCalculator[type as TStatsType], ...calc}];
            }),
        ),
    };
};

const refineConfig = (mergedStats: IMergedStats, defaultStats: IDefaultStats): IRefinedConfig => {
    const stats = extractStats(mergedStats);
    const defaultCalculator = extractCalculator(defaultStats);
    const calculator = extractCalculator(mergedStats);

    return {
        stats,
        calculator: mergeCalculator(calculator, defaultCalculator),
    };
};
