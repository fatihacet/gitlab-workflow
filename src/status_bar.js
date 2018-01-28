const vscode = require('vscode');
const gitLabService = require('./gitlab_service');

let context = null;
let pipelineStatusBarItem = null;
let mrStatusBarItem = null;

const createStatusBarItem = (text) => {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(statusBarItem);
  statusBarItem.text = text;
  statusBarItem.show();

  return statusBarItem;
}

async function refreshPipelines() {
  const pipeline = await gitLabService.fetchLastPipelineForCurrentBranch();
  const statuses = {
    running: { icon: 'pulse' },
    pending: { icon: 'clock' },
    success: { icon: 'check', text: 'passed' },
    failed: { icon: 'x' },
    canceled: { icon: 'circle-slash' },
    skipped: { icon: 'diff-renamed' },
  }

  if (pipeline) {
    const { status } = pipeline;
    pipelineStatusBarItem.text = `$(${statuses[status].icon}) GitLab: Pipeline ${statuses[status].text || status}`;
    pipelineStatusBarItem.show();
  } else {
    pipelineStatusBarItem.text = 'GitLab: No pipeline';
    pipelineStatusBarItem.hide();
  }
}

const initPipelineStatus = () => {
  pipelineStatusBarItem = createStatusBarItem('$(info) GitLab: Fetching pipeline...');
  setTimeout(() => { refreshPipelines() }, 25000);

  refreshPipelines();
}

const initMrStatus = () => {
  mrStatusBarItem = createStatusBarItem('$(info) GitLab: Finding MR...');

  fetchBranchMr();
}

async function fetchBranchMr() {
  const mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();
  let text = '$(git-pull-request) GitLab: MR not found.';

  if (mr) {
    text = `$(git-pull-request) GitLab: MR !${mr.iid}`;
  }

  mrStatusBarItem.text = text;
}

const init = (ctx) => {
  context = ctx;

  initPipelineStatus();
  initMrStatus();
const dispose = () => {
  mrStatusBarItem.hide();
  pipelineStatusBarItem.hide();
}

}

exports.init = init;
exports.dispose = dispose;
