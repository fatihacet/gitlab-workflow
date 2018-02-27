const vscode = require('vscode');
const opn = require('opn');
const gitLabService = require('./gitlab_service');

let context = null;
let pipelineStatusBarItem = null;
let mrStatusBarItem = null;
let mrIssueStatusBarItem = null;
let issue = null;
let mr = null;
const { showIssueLinkOnStatusBar } = vscode.workspace.getConfiguration('gitlab');

const createStatusBarItem = (text, command) => {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(statusBarItem);
  statusBarItem.text = text;
  statusBarItem.show();

  if (command) {
    statusBarItem.command = command;
  }

  return statusBarItem;
}

const commandRegisterHelper = (cmdName, callback) => {
  vscode.commands.registerCommand(cmdName, callback);
}

async function refreshPipelines() {
  let project = null;
  let pipeline = null;
  const statuses = {
    running: { icon: 'pulse' },
    pending: { icon: 'clock' },
    success: { icon: 'check', text: 'passed' },
    failed: { icon: 'x' },
    canceled: { icon: 'circle-slash' },
    skipped: { icon: 'diff-renamed' },
  }

  try {
    project = await gitLabService.fetchCurrentProject();
    pipeline = await gitLabService.fetchLastPipelineForCurrentBranch();
  } catch (e) {
    if (!project) {
      return pipelineStatusBarItem.hide();
    }
    console.log('Failed to execute refreshPipelines.', e);
  }

  if (pipeline) {
    const { status } = pipeline;
    pipelineStatusBarItem.text = `$(${statuses[status].icon}) GitLab: Pipeline ${statuses[status].text || status}.`;
    pipelineStatusBarItem.show();
  } else {
    pipelineStatusBarItem.text = 'GitLab: No pipeline.';
  }
}

const initPipelineStatus = () => {
  pipelineStatusBarItem = createStatusBarItem('$(info) GitLab: Fetching pipeline...', 'gl.pipelineActions');
  setInterval(() => { refreshPipelines() }, 30000);

  refreshPipelines();
}

const initMrStatus = () => {
  const cmdName = `gl.mrOpener${Date.now()}`;
  commandRegisterHelper(cmdName, () => {
    if (mr) {
      opn(mr.web_url);
    } else {
      vscode.window.showInformationMessage('GitLab Workflow: No MR found for this branch.');
    }
  });

  mrStatusBarItem = createStatusBarItem('$(info) GitLab: Finding MR...', cmdName);
  setInterval(() => { fetchBranchMr() }, 60000);

  fetchBranchMr();
}

async function fetchBranchMr() {
  let project = null;
  let text = '$(git-pull-request) GitLab: No MR.';

  try {
    project = await gitLabService.fetchCurrentProject();
    mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();
  } catch (e) {
    mrStatusBarItem.hide();
  }

  if (mr) {
    text = `$(git-pull-request) GitLab: MR !${mr.iid}`;
    fetchMRIssues();
  } else {
    if (project) {
      mrIssueStatusBarItem.text = `$(code) GitLab: No issue.`;
    } else {
      mrIssueStatusBarItem.hide();
    }
  }

  mrStatusBarItem.text = text;
}

async function fetchMRIssues() {
  const issues = await gitLabService.fetchMRIssues(mr.iid);
  let text = `$(code) GitLab: No issue.`;

  if (issues[0]) {
    issue = issues[0];
    text = `$(code) GitLab: Issue #${issue.iid}`;
  }

  mrIssueStatusBarItem.text = text;
}

const initMrIssueStatus = () => {
  const cmdName = `gl.mrIssueOpener${Date.now()}`;
  commandRegisterHelper(cmdName, () => {
    if (issue) {
      opn(issue.web_url);
    } else {
      vscode.window.showInformationMessage('GitLab Workflow: No closing issue found for this MR.');
    }
  });

  mrIssueStatusBarItem = createStatusBarItem('$(info) GitLab: Fetching closing issue...', cmdName);
}

const init = (ctx) => {
  context = ctx;

  initPipelineStatus();
  initMrStatus();
  if (showIssueLinkOnStatusBar) {
    initMrIssueStatus();
  }
}

const dispose = () => {
  mrStatusBarItem.dispose();
  pipelineStatusBarItem.dispose();
  if (showIssueLinkOnStatusBar) {
    mrIssueStatusBarItem.dispose();
  }
}

exports.init = init;
exports.dispose = dispose;
exports.refreshPipelines = refreshPipelines;
