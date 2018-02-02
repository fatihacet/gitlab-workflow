const vscode = require('vscode');
const opn = require('opn');
const gitLabService = require('./gitlab_service');

let context = null;
let pipelineStatusBarItem = null;
let mrStatusBarItem = null;
let mrIssueStatusBarItem = null;
let issueId = null;
let projectPath = null;
let mr = null;

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
  const cmdName = 'gl.mrOpener';
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
  let text = '$(git-pull-request) GitLab: No MR.';

  try {
    const project = await gitLabService.fetchCurrentProject();
    projectPath = project.web_url;
    mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();
  } catch (e) {
    mrStatusBarItem.hide();
  }

  if (mr) {
    text = `$(git-pull-request) GitLab: MR !${mr.iid}`;
    fetchMRIssues();
  } else {
    mrIssueStatusBarItem.text = `$(code) GitLab: No issue.`;
  }

  mrStatusBarItem.text = text;
}

async function fetchMRIssues() {
  const issues = await gitLabService.fetchMRIssues(mr.iid);
  let text = `$(code) GitLab: No issue.`;

  if (issues[0]) {
    issueId = issues[0].iid;
    text = `$(code) GitLab: Issue #${issueId}`;
  }

  mrIssueStatusBarItem.text = text;
}

const initMrIssueStatus = () => {
  const cmdName = `gl.mrIssueOpener`;
  commandRegisterHelper(cmdName, () => {
    if (issueId) {
      opn(`${projectPath}/issues/${issueId}`);
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
  initMrIssueStatus();
}

const dispose = () => {
  mrStatusBarItem.dispose();
  pipelineStatusBarItem.dispose();
  mrIssueStatusBarItem.dispose();
}

exports.init = init;
exports.dispose = dispose;
exports.refreshPipelines = refreshPipelines;
