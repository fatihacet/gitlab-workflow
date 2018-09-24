const vscode = require('vscode');
const openers = require('./openers');
const gitLabService = require('./gitlab_service');

let context = null;
let pipelineStatusBarItem = null;
let pipelinesStatusTimer = null;
let mrStatusBarItem = null;
let mrIssueStatusBarItem = null;
let mrStatusTimer = null;
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
};

const commandRegisterHelper = (cmdName, callback) => {
  vscode.commands.registerCommand(cmdName, callback);
};

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
  };

  try {
    project = await gitLabService.fetchCurrentProject();
    pipeline = await gitLabService.fetchLastPipelineForCurrentBranch();
  } catch (e) {
    if (!project) {
      pipelineStatusBarItem.hide();
      return;
    }

    console.log('Failed to execute refreshPipelines.', e);
  }

  if (pipeline) {
    const { status } = pipeline;
    const msg = `$(${statuses[status].icon}) GitLab: Pipeline ${statuses[status].text || status}.`;
    pipelineStatusBarItem.text = msg;
    pipelineStatusBarItem.show();
  } else {
    pipelineStatusBarItem.text = 'GitLab: No pipeline.';
  }
}

const initPipelineStatus = () => {
  pipelineStatusBarItem = createStatusBarItem(
    '$(info) GitLab: Fetching pipeline...',
    'gl.pipelineActions',
  );
  pipelinesStatusTimer = setInterval(() => {
    refreshPipelines();
  }, 30000);

  refreshPipelines();
};

async function fetchMRIssues() {
  const issues = await gitLabService.fetchMRIssues(mr.iid);
  let text = `$(code) GitLab: No issue.`;

  if (issues[0]) {
    [issue] = issues;
    text = `$(code) GitLab: Issue #${issue.iid}`;
  }

  mrIssueStatusBarItem.text = text;
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
  } else if (project) {
    mrIssueStatusBarItem.text = `$(code) GitLab: No issue.`;
  } else {
    mrIssueStatusBarItem.hide();
  }

  mrStatusBarItem.text = text;
}

const initMrStatus = () => {
  const cmdName = `gl.mrOpener${Date.now()}`;
  commandRegisterHelper(cmdName, () => {
    if (mr) {
      openers.openUrl(mr.web_url);
    } else {
      vscode.window.showInformationMessage('GitLab Workflow: No MR found for this branch.');
    }
  });

  mrStatusBarItem = createStatusBarItem('$(info) GitLab: Finding MR...', cmdName);
  mrStatusTimer = setInterval(() => {
    fetchBranchMr();
  }, 60000);

  fetchBranchMr();
};

const initMrIssueStatus = () => {
  const cmdName = `gl.mrIssueOpener${Date.now()}`;
  commandRegisterHelper(cmdName, () => {
    if (issue) {
      openers.openUrl(issue.web_url);
    } else {
      vscode.window.showInformationMessage('GitLab Workflow: No closing issue found for this MR.');
    }
  });

  mrIssueStatusBarItem = createStatusBarItem('$(info) GitLab: Fetching closing issue...', cmdName);
};

const init = ctx => {
  context = ctx;

  initPipelineStatus();
  initMrStatus();
  if (showIssueLinkOnStatusBar) {
    initMrIssueStatus();
  }
};

const dispose = () => {
  mrStatusBarItem.dispose();
  pipelineStatusBarItem.dispose();
  if (showIssueLinkOnStatusBar) {
    mrIssueStatusBarItem.dispose();
  }

  if (pipelinesStatusTimer) {
    clearInterval(pipelinesStatusTimer);
    pipelinesStatusTimer = null;
  }

  if (mrStatusTimer) {
    clearInterval(mrStatusTimer);
    mrStatusTimer = null;
  }
};

exports.init = init;
exports.dispose = dispose;
exports.refreshPipelines = refreshPipelines;
