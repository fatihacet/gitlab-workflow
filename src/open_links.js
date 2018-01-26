const vscode = require('vscode');
const opn = require('opn');
const { instanceUrl, userId } = vscode.workspace.getConfiguration('gitlab');

const showIssues = () => {
  opn(`${instanceUrl}/dashboard/issues?assignee_id=${userId}`);
};

const showMergeRequests = () => {
  opn(`${instanceUrl}/dashboard/merge_requests?assignee_id=${userId}`);
};

exports.showIssues = showIssues;
exports.showMergeRequests = showMergeRequests;
