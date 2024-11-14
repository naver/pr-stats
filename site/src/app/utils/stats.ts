export const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
    }

    const numerator = sumXY - (sumX * sumY) / n;
    const denominator = Math.sqrt((sumX2 - (sumX * sumX) / n) * (sumY2 - (sumY * sumY) / n));

    if (denominator === 0) {
        return 0; // 분모가 0이면 상관관계를 계산할 수 없음
    }

    return numerator / denominator;
};

export type TCorrelationMap = Record<string, Record<string, number>>;

/**
 * 데이터 목록을 아래와 같은 형태의 상관계수를 나타내는 객체 형태로 변환
 * {
 *    a: { a: 1, b: 상관계수, c: 상관계수 },
 *    b: { a: 상관계수, b: 1, c: 상관계수 },
 *    c: { a: 상관계수, b: 상관계수, c: 1 }
 *  }
 */
export const createCorrelationMap = (dataList: Record<string, number>[]): TCorrelationMap => {
    const keys = Object.keys(dataList[0]);

    return keys.reduce<TCorrelationMap>((correlationMap, key1) => {
        const values1 = dataList.map(item => item[key1]);

        correlationMap[key1] = keys.reduce<Record<string, number>>((row, key2) => {
            const values2 = dataList.map(item => item[key2]);

            row[key2] = calculatePearsonCorrelation(values1, values2);

            return row;
        }, {});

        return correlationMap;
    }, {});
};

export const findMedian = (arr: number[]): number => {
    const sorted = arr.toSorted((a, b) => a - b);

    const midIndex = Math.floor(sorted.length / 2);

    return sorted.length % 2 !== 0 ? sorted[midIndex] : (sorted[midIndex - 1] + sorted[midIndex]) / 2;
};
