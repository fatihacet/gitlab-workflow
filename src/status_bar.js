const vscode = require('vscode');
const gitLabService = require('./gitlab_service');

let context = null;
let pipelineStatusBarItem = null;
let mrStatusBarItem = null;

const createStatusBarItem = (text) => {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = text;
  context.subscriptions.push(statusBarItem);

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
  pipelineStatusBarItem = createStatusBarItem('GitLab: Fetching pipeline...');
  setTimeout(() => { refreshPipelines() }, 25000);

  refreshPipelines();
}

const initMrStatus = () => {
  mrStatusBarItem = createStatusBarItem('GitLab: Fetching MR...');

  fetchBranchMr();
}

async function fetchBranchMr() {
  const mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();

  if (mr) {
    mrStatusBarItem.text = `GitLab: MR !${mr.iid}`;
    mrStatusBarItem.show();
  } else {
    mrStatusBarItem.hide();
  }
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
