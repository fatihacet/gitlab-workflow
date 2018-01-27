const vscode = require('vscode');
const opn = require('opn');
const gitService = require('./git_service');
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

async function openActiveFileOnWeb() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const currentProject = await gitLabService.fetchCurrentProject();

    if (currentProject) {
      const branchName = await gitService.fetchBranchName();
      const filePath = editor.document.uri.path.replace(vscode.workspace.rootPath, '');
      let fileUrl = `${currentProject.web_url}/blob/${branchName}/${filePath}`;
      let anchor = '';

      if (editor.selection) {
        const { start, end } = editor.selection;
        anchor = `#L${start.line + 1}`;

        if (end.line > start.line) {
          anchor += `-${end.line + 1}`;
        }
      }

      opn(`${fileUrl}${anchor}`);
    } else {
      vscode.window.showInformationMessage('GitLab Workflow: Failed to open file on web. No GitLab project.');
    }
  } else {
    vscode.window.showInformationMessage('GitLab Workflow: No open file.');
  }
}

async function openCurrentMergeRequestOnWeb() {
  const mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();

  if (mr) {
    opn(mr.web_url);
  }
}

exports.showIssues = showIssues;
exports.showMergeRequests = showMergeRequests;
exports.openActiveFileOnWeb = openActiveFileOnWeb;
exports.openCurrentMergeRequestOnWeb = openCurrentMergeRequestOnWeb;
