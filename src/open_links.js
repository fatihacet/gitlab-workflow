const vscode = require('vscode');
const opn = require('opn');
const gitLabService = require('./gitlab_service');

const { instanceUrl } = vscode.workspace.getConfiguration('gitlab');

async function openLink(link) {
  const user = await gitLabService.fetchUser();

  if (user) {
    opn(link.replace('$userId', user.id));
  } else {
    vscode.window.showInformationMessage('GitLab Workflow: GitLab user not found. Check your Personal Access Token.');
  }
};

async function showIssues() {
  await openLink(`${instanceUrl}/dashboard/issues?assignee_id=$userId`);
}

async function showMergeRequests() {
  await openLink(`${instanceUrl}/dashboard/merge_requests?assignee_id=$userId`);
};

exports.showIssues = showIssues;
exports.showMergeRequests = showMergeRequests;
