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

async function openActiveFile() {
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

async function openCurrentMergeRequest() {
  const mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();

  if (mr) {
    opn(mr.web_url);
  }
}

async function openCreateNewIssue() {
  const project = await gitLabService.fetchCurrentProject();

  if (project) {
    opn(`${project.web_url}/issues/new`);
  } else {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to open file on web. No GitLab project.');
  }
};

async function openCreateNewMr() {
  const project = await gitLabService.fetchCurrentProject();

  if (project) {
    const branchName = await gitService.fetchBranchName();

    opn(`${project.web_url}/merge_requests/new?merge_request%5Bsource_branch%5D=${branchName}`);
  } else {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to open file on web. No GitLab project.');
  }
};

exports.showIssues = showIssues;
exports.showMergeRequests = showMergeRequests;
exports.openActiveFile = openActiveFile;
exports.openCurrentMergeRequest = openCurrentMergeRequest;
exports.openCreateNewIssue = openCreateNewIssue;
exports.openCreateNewMr = openCreateNewMr;
