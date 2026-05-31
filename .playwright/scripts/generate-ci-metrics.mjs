import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const resultsPath = path.join(cwd, 'test-results', 'playwright-results.json');
const metricsDir = path.join(cwd, 'ci-metrics');
const metricsJsonPath = path.join(metricsDir, 'execution-metrics.json');
const metricsCsvPath = path.join(metricsDir, 'execution-metrics.csv');
const summaryPath = path.join(metricsDir, 'execution-summary.md');

function readPlaywrightReport() {
  if (!fs.existsSync(resultsPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
}

function collectTests(suites = [], collected = []) {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        collected.push(test);
      }
    }

    collectTests(suite.suites ?? [], collected);
  }

  return collected;
}

function summarizeTests(report) {
  const tests = report ? collectTests(report.suites) : [];
  const counters = {
    total: tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
  };

  for (const test of tests) {
    const resultStatuses = (test.results ?? []).map((result) => result.status);
    const lastStatus = resultStatuses.at(-1) ?? test.status ?? 'unknown';

    if (lastStatus === 'passed') {
      counters.passed += 1;
      if (resultStatuses.some((status) => status !== 'passed')) {
        counters.flaky += 1;
      }
      continue;
    }

    if (lastStatus === 'skipped') {
      counters.skipped += 1;
      continue;
    }

    counters.failed += 1;
  }

  return counters;
}

function csvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const report = readPlaywrightReport();
const testSummary = summarizeTests(report);
const exitCode = Number(process.env.CI_TEST_EXIT_CODE ?? 1);
const metrics = {
  workflow: process.env.GITHUB_WORKFLOW ?? 'local',
  runId: process.env.GITHUB_RUN_ID ?? '',
  runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? '',
  event: process.env.GITHUB_EVENT_NAME ?? '',
  branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '',
  commitSha: process.env.GITHUB_SHA ?? '',
  startedAtUtc: process.env.CI_TEST_START_ISO ?? '',
  endedAtUtc: process.env.CI_TEST_END_ISO ?? '',
  durationSeconds: Number(process.env.CI_TEST_DURATION_SECONDS ?? 0),
  exitCode,
  status: exitCode === 0 ? 'passed' : 'failed',
  ...testSummary,
};

fs.mkdirSync(metricsDir, { recursive: true });
fs.writeFileSync(metricsJsonPath, `${JSON.stringify(metrics, null, 2)}\n`);

const headers = Object.keys(metrics);
const csv = [
  headers.map(csvValue).join(','),
  headers.map((header) => csvValue(metrics[header])).join(','),
].join('\n');
fs.writeFileSync(metricsCsvPath, `${csv}\n`);

const summary = [
  '# Métricas da execução automatizada',
  '',
  '| Métrica | Valor |',
  '| --- | --- |',
  `| Status | ${metrics.status} |`,
  `| Duração da suíte | ${metrics.durationSeconds} s |`,
  `| Casos identificados no relatório | ${metrics.total} |`,
  `| Casos aprovados | ${metrics.passed} |`,
  `| Casos com falha | ${metrics.failed} |`,
  `| Casos ignorados | ${metrics.skipped} |`,
  `| Casos instáveis após retry | ${metrics.flaky} |`,
  `| Evento | ${metrics.event || 'local'} |`,
  `| Branch | ${metrics.branch || 'local'} |`,
  `| Commit | ${metrics.commitSha || 'local'} |`,
  '',
  'Arquivos para coleta: `execution-metrics.csv`, `execution-metrics.json`, relatório HTML e relatórios Playwright JSON/JUnit.',
  '',
].join('\n');

fs.writeFileSync(summaryPath, summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

console.log(summary);
