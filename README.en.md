# pr-stats

🌏 [**한국어**](README.md) | English

GitHub Actions to generate useful statistics for pull requests.

It calculates metrics such as the average time to merge per PR and reviewer response times. The statistics can be [customized](#Customize) as needed.

For ways to apply it in your tasks, see the [usage examples](#Usage-examples).

## Usage

Create the following file in your GitHub repository:

```yaml
# .github/workflows/pr-stats.yml
name: PR Stats
on:
  workflow_dispatch: # Specify the event that triggers the action
  # https://docs.github.com/ko/actions/using-workflows/events-that-trigger-workflows
jobs:
  pr-stats:
    runs-on: ubuntu-latest
    steps:
      - name: PR Stats
        uses: "naver/pr-stats@v1.0.0" # Path to the action and the version to use
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # Be sure to check the documentation for 'with'.
```

**Usage example) Generate results as a PR**

```yaml
# .github/workflows/pr-stats.yml
    # ...
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: PR Stats
        uses: "naver/pr-stats@v1.0.0"
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
```

With this setup, a PR will be created with `pr.csv`, `prList.csv`, and `user.csv` files under the `./stats/` directory.


## Collected Data

### PR

Statistics for individual PRs. This data is saved as `./stats/pr.csv`.

| Field                         | Description                       |
|-------------------------------|-----------------------------------|
| `number`                      | PR number                         |
| `title`                       | PR title                          |
| `createdAt`                   | Timestamp of PR creation          |
| `mergedAt`                    | Timestamp of PR merged            |
| `addedLineCount`              | Number of lines added             |
| `removedLineCount`            | Number of lines removed           |
| `changedLineCount`            | Number of lines changed           |
| `fileCount`                   | Number of files                   |
| `commitCount`                 | Number of commits                 |
| `commentCount`                | Number of comments                |
| `conversationCount`           | Number of conversations           |
| `reviewerCount`               | Number of reviewers               |
| `approvalCount`               | Number of approvals               |
| `participationCount`          | Number of participations          |
| `participationRate`           | Participation rate                |
| `timeFromReviewToMerge`       | Time from review to merge (ms)    |
| `averageResponseTime`         | Average response time (ms)        |
| `averageTimeToApproval`       | Average time to approval (ms)     |
| `averageLinesChangedPerCommit` | Average lines changed per commit  |

### PR list

Statistics calculated for all collected PRs. This data is saved as `./stats/prList.csv`.

| Field                          | Description          |
|--------------------------------|----------------------|
| `averageAddedLineCount`      | Average number of added lines    |
| `averageRemovedLineCount`    | Average number of removed lines  |
| `averageChangedLineCount`    | Average number of changed lines  |
| `averageFileCount`           | Average number of files          |
| `averageCommitCount`         | Average number of commits        |
| `averageCommentCount`        | Average number of comments       |
| `averageConversationCount`   | Average number of conversations  |
| `averageReviewerCount`       | Average number of reviewers      |
| `averageApprovalCount`       | Average number of approvals      |
| `averageParticipationCount`  | Average number of participations |
| `averageTimeFromReviewToMerge` | Average time from review to merge (ms) |
| `averageResponseTime`        | Average response time (ms)       |
| `averageTimeToApproval`      | Average time to approval (ms)    |
| `averageLinesChangedPerCommit` | Average lines changed per commit |
| `participationRate`          | Participation rate               |

### User

Statistics calculated for each user from the collected data. This data is saved as `./stats/user.csv`.

| Field                         | Description                        |
|------------------------------|------------------------------------|
| `id`                         | User ID                            |
| `requestedCount`             | Number of requests received        |
| `participationCount`         | Number of participations           |
| `participationRate`          | Participation rate (xx.xx)         |
| `averageCommentCount`        | Average number of comments         |
| `averageResponseTime`        | Average response time (ms)         |
| `averageTimeToApproval`      | Average time to approval (ms)      |
| `averageLinesChangedPerCommit` | Average lines changed per commit   |

## Customize

By adding a `stats.config.js` file to the root of your repository, you can modify the statistics to be output.

> The `stats.config.js` file is optional. If it's not created, the default behavior will be used.


### Controlling statistics fields

For example, if you configure it like this, `pr` will output `number`, `title`, and `fileCount` fields, `prList` will not be output, and `user` will only output the `id`.

```javascript
// {targetRepo}/stats.config.js
module.exports = {
    pr: ["number", "title", "fileCount"],
    prList: [],
    user: ["id"],
};
```

### Adding statistics fields

The default statistics configuration (`defaultStats`) is passed as an argument to the exported function. This allows you to maintain the default statistics settings while adding specific statistics.

Here's an example of calculating the fastest response time(ms).

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

## `with` parameters

| Name            | Description                                                                                                                                             | Default value                 | Example usage                                                      |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|--------------------------------------------------------------------|
| `token`         | GitHub token                                                                                                                                            | `${{ secrets.GITHUB_TOKEN }}` | `token: "xoxb-798572638592-435243279588-9aCaWNnzVYelK9NzMMqa1yxz"` |
| `repository`    | The repository where `pr-stats` will run. If not provided, it defaults to the repository where the `pr-stats.yml` file is located.                      | `${{ github.repository }}`    | `repository: "organization/repository"`                            |
| `ignoreUsers`   | List of users to exclude from PR statistics. Multiple users can be added, separated by commas.                                                          | `""` (empty string)           | `ignoreUsers: "brown"`<br>`ignoreUsers: "sonarqube[bot],lee-load"` |
| `configPath`    | The path to the statistics configuration file.                                                                                                          | `"./stats.config.js"`         | `configPath: "./settings/stats.config.js"`                         |
| `period`        | Specifies the period for PR statistics. If not provided, `count` will be used.                                                                          | `""` (empty string)           | `period: "2023-09-01~2023-10-01"`<br>`period: "2023-09-01~"`       |
| `count`         | Specifies the number of PRs to fetch. If not provided, `period` will be used.                                                                           | `100`                         | `count: 50`                                                        |
| `baseBranch`    | Specifies the branch to target for statistics. It extracts statistics for PRs where this branch is the base. If not provided, all PRs will be targeted. | `""` (empty string)           | `baseBranch: "main"`                                               |
| `output`        | Specifies the data output format. Multiple formats can be used, separated by commas. (Valid formats: `console`, `csv`)                                  | `"console,csv"`               | `output: "csv"`                                                    |

> ⚠️ The `period` parameter takes precedence over `count`; if `period` is provided, `count` will be ignored.

## Usage examples
Using this action, you can clearly understand your team's code review status and identify areas for improvement.

### 1. Analysis through a correlation table

For example, using Python code or generative AI, you can create a correlation table like the one below based on PR statistics.

<img src="https://github.com/user-attachments/assets/42774705-ae06-4bed-aff9-17e4c82034a1" width="600" height="600" alt="correlation-heatmap">

If you want to shorten the time it takes to merge, you could find metrics with a high correlation to `timeFromReviewToMerge` and focus on improving them.

### 2. Analysis through scatter plots

You can assess how much progress has been made by analyzing numerical changes.

For example, to see how much the review response time and participation rate of team members have improved, you can use scatter plots and density charts like the ones below.

<img width="700" alt="before" src="https://github.com/user-attachments/assets/1b6be920-45ae-4483-95fb-711fdc24c10f">

In the scatter plot on the left, each point represents the average response time and participation rate of a reviewer. Points closer to the top-left indicate higher participation and shorter response times.

If the chart looks like the one below after improvement activities, it shows that the efforts were highly successful.

<img width="700" alt="after" src="https://github.com/user-attachments/assets/30ac9605-aa41-4cfa-a46b-ac32396172a2">


## License

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
