# pr-stats

## 액션 소개
pr-stats는 PR에 대한 유용한 통계를 산출하는 GitHub Actions입니다.

PR별 평균 머지까지 소요되는 시간, 리뷰어의 응답시간 등을 산출할 수 있습니다.

통계 결과는 [커스터마이즈](#커스터마이즈) 할 수 있습니다.

## 사용 방법
GitHub 저장소에 아래 파일을 만드세요.

```yaml
# .github/workflows/pr-stats.yml
name: PR Stats
on:
  workflow_dispatch: # 액션이 실행될 이벤트를 작성하세요.
  # https://docs.github.com/ko/actions/using-workflows/events-that-trigger-workflows
jobs:
  pr-stats:
    runs-on: ubuntu-latest
    steps:
      - name: PR Stats
        uses: "naver/pr-stats@v0.1.0"
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # with 인자 설명을 반드시 참고하세요.
```

**활용 예시) 결과물을 PR로 생성**

다음과 같이 작성하면 `./stats/` 하위에 `pr.csv`, `prList.csv`, `user.csv`가 포함된 PR이 만들어집니다.

```yaml
# .github/workflows/pr-stats.yml
    # ...
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: PR Stats
        uses: "naver/pr-stats@v0.1.0"
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
```


## 수집 데이터

### PR
단일 PR에 대한 통계입니다. 이 데이터는 `./stats/pr.csv`로 저장됩니다.

| 필드                         | 설명                      |
|------------------------------|---------------------------|
| `number`                     | PR 번호                   |
| `title`                      | PR 제목                   |
| `addedLineCount`             | 추가된 라인 수            |
| `removedLineCount`           | 제거된 라인 수            |
| `changedLineCount`           | 변경된 라인 수            |
| `fileCount`                  | 파일 개수                 |
| `commitCount`                | 커밋 개수                 |
| `commentCount`               | 코멘트 개수               |
| `conversationCount`          | 대화 개수                 |
| `reviewerCount`              | 리뷰어 수                 |
| `approvalCount`              | 승인 수                   |
| `participationCount`         | 참여 수                   |
| `timeFromReviewToMerge`      | 리뷰에서 병합까지의 시간 (ms)  |
| `averageResponseTime`        | 평균 응답 시간 (ms)           |
| `averageTimeToApproval`      | 평균 승인까지의 시간 (ms)     |
| `averageLinesChangedPerCommit` | 커밋당 평균 변경 라인 수  |

### PR List
수집한 모든 PR에 대해서 산출한 통계입니다. 이 데이터는 `./stats/prList.csv`로 저장됩니다.

| 필드                         | 설명                      |
|------------------------------|---------------------------|
| `averageAddedLineCount`      | 평균 추가된 라인 수       |
| `averageRemovedLineCount`    | 평균 제거된 라인 수       |
| `averageChangedLineCount`    | 평균 변경된 라인 수       |
| `averageFileCount`           | 평균 파일 개수            |
| `averageCommitCount`         | 평균 커밋 개수            |
| `averageCommentCount`        | 평균 코멘트 개수          |
| `averageConversationCount`   | 평균 대화 개수            |
| `averageReviewerCount`       | 평균 리뷰어 수            |
| `averageApprovalCount`       | 평균 승인 수              |
| `averageParticipationCount`  | 평균 참여 수              |
| `averageTimeFromReviewToMerge` | 리뷰에서 병합까지의 평균 시간 (ms) |
| `averageResponseTime`        | 평균 응답 시간 (ms)       |
| `averageTimeToApproval`      | 평균 승인까지의 시간 (ms) |
| `averageLinesChangedPerCommit` | 커밋당 평균 변경 라인 수  |

### User
수집된 데이터에서 각 유저들에 대해 산출한 통계입니다. 이 데이터는 `./stats/user.csv`로 저장됩니다.

| 필드                         | 설명                      |
|------------------------------|---------------------------|
| `id`                         | 사용자 ID                 |
| `requestedCount`             | 요청 수                   |
| `participationCount`         | 참여 수                   |
| `participationRate`          | 참여율 (xx.xx)            |
| `averageCommentCount`        | 평균 코멘트 개수          |
| `averageResponseTime`        | 평균 응답 시간 (ms)       |
| `averageTimeToApproval`      | 평균 승인까지의 시간 (ms) |
| `averageLinesChangedPerCommit` | 커밋당 평균 변경 라인 수|

## 커스터마이즈
액션을 실행하는 저장소 Root에 `stats.config.js` 을 추가하면, 출력할 통계 항목을 변경할 수 있습니다.

> `stats.config.js` 파일은 필수로 생성하지 않아도 되며, 생성하지 않을 경우 기본동작을 실행합니다.

### 통계 항목 제어
다음과 같이 작성하면, `pr`은 `number`, `title`, `fileCount`, `prList`는 미출력, `user`는 `id`만 출력됩니다.

```javascript
// {targetRepo}/stats.config.js
module.exports = {
    pr: ["number", "title", "fileCount"],
    prList: [],
    user: ["id"],
};
```

### 통계 항목 추가
함수 형태로 export 하면 기본 통계 설정 정보(`defaultStats`)가 인자로 전달됩니다. 이를 통해 기본 통계 설정을 유지하며 특정 통계만 추가할 수 있습니다.

다음은 가장 빠른 응답 시간(ms)을 구하는 예시입니다.

```javascript
// {targetRepo}/stats.config.js
const firstResponseTime = pr => {
    const {timeline} = pr;
    const firstResponse = timeline.comments.find(comment => timeline.firstRequestedAt < comment.createdAt);
    const value = Number(firstResponse.createdAt) - Number(timeline.firstRequestedAt);

    return {value, message: `First Response Time: ${value}`};
};

module.exports = defaultStats => {
    return {
        ...defaultStats,
        pr: [...defaultStats.pr, ["firstResponseTime", firstResponseTime]],
    };
};
```

## with 인자 설명

| 이름             | 설명                                                                           | 기본 값                                | 사용 예시                                                               |
|----------------|------------------------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------|
| `token`        | GitHub에서 제공하는 토큰입니다.                                                         | `${{ secrets.GITHUB_TOKEN }}`       | `token: "xoxb-798572638592-435243279588-9aCaWNnzVYelK9NzMMqa1yxz"`  |
| `repository`   | GitHub Action이 진행될 저장소입니다. 입력하지 않을 시, `pr-stats.yml` 파일을 만든 저장소에서 통계를 추출합니다. | `${{ github.repository }}`          | `repository: "organization/repository"`                             |
| `ignoreUsers`  | PR 통계에 포함하지 않을 사용자 목록입니다. 쉼표(,)로 여러 사용자를 등록할 수 있습니다.                         | `""` (빈 문자열)                        | `ignoreUsers: "brown"`<br>`ignoreUsers: "sonarqube[bot],lee-load"`  |
| `configPath`   | 통계 설정 파일 경로입니다.                                                              | `"./stats.config.js"`               | `configPath: "./settings/stats.config.js"`                          |
| `period`       | PR 통계 대상 기간을 지정합니다. 입력하지 않을 경우, `count`를 따릅니다.                               | `""` (빈 문자열)                        | `period: "2023-09-01~2023-10-01"`<br>`period: "2023-09-01~"`        |
| `count`        | 조회할 PR의 개수를 설정합니다. 입력하지 않은 경우, `period`를 따릅니다.                               | `100`                               | `count: 50`                                                         |
| `baseBranch`   | 작업의 기준이 되는 branch를 지정합니다. 입력하지 않으면 모든 branch에 대해 조회합니다.                      | `""` (빈 문자열)                        | `baseBranch: "main"`                                                |
| `output` | 데이터 출력 방식을 지정합니다. 쉼표(,)로 여러 방식을 함께 사용할 수 있습니다. (유효한 형식: `console`, `csv`) | `"console,csv"` | `output: "csv"` |

> ⚠️ `period`의 우선순위가 `count`보다 높습니다. `period`가 있을 경우, `count`는 무시됩니다.

## 배포 라이선스

```
Copyright (c) 2023-present NAVER Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
