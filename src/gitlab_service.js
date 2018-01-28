const vscode = require('vscode');
const request = require('request-promise');
const gitService = require('./git_service');
let glToken = null;

async function fetch(path) {
  const { instanceUrl } = vscode.workspace.getConfiguration('gitlab');
  const apiRoot = `${instanceUrl}/api/v4`;

  if (!glToken) {
    return vscode.window.showInformationMessage('GitLab Workflow: Cannot make request. No token found.');
  }

  const config = {
    url: `${apiRoot}${path}`,
    headers: {
      'PRIVATE-TOKEN': glToken,
    }
  };

  const response = await request(config);

  try {
    return JSON.parse(response);
  } catch (e) {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to perform your operation.');
    return { error: e };
  }
}

async function fetchUser() {
  try {
    return await fetch('/user');
  } catch (e) {
    vscode.window.showInformationMessage('GitLab Workflow: GitLab user not found. Check your Personal Access Token.');
  }
}

// FIXME: Don't rely on `created-by-me`. It doesn't have to be my own MR.
// Currently GL API doesn't support finding MR by branch name or commit id.
async function fetchMyOpenMergeRequests() {
  const project = await fetchCurrentProject();

  if (project) {
    return await fetch(`/projects/${project.id}/merge_requests?scope=created-by-me&state=opened`);
  }

  return [];
}

async function fetchLastPipelineForCurrentBranch() {
  const project = await fetchCurrentProject();

  if (project) {
    const branchName = await gitService.fetchTrackingBranchName();
    const pipelinesRootPath = `/projects/${project.id}/pipelines`;
    const pipelines = await fetch(`${pipelinesRootPath}?ref=${branchName}`);

    if (pipelines.length) {
      return await fetch(`${pipelinesRootPath}/${pipelines[0].id}`);
    }

    return null;
  }

  return null;
}

async function fetchCurrentProject() {
  const remote = await gitService.fetchGitRemote();

  if (remote) {
    const { namespace, project } = remote;
    const projectData = await fetch(`/projects/${namespace}%2F${project}`);

    return projectData || null;
  }

  return null;
}

async function fetchOpenMergeRequestForCurrentBranch() {
  const project = await fetchCurrentProject();
  const branchName = await gitService.fetchTrackingBranchName();
  let page = 1;

  async function fetcher() {
    const mrs = await fetch(`/projects/${project.id}/merge_requests?state=opened&per_page=100&page=${page}`);

    const [mr] = mrs.filter((mr) => {
      return mr.source_branch === branchName;
    });

    if (mr) {
      return mr;
    }

    if (page <= 5) {
      console.log(`Couldn't find on page ${page}. Fetching ${page + 1}`);
      page = page + 1;
      return await fetcher();
    }
  }

  return project ? await fetcher() : null;
}

const _setGLToken = (token) => {
  glToken = token;
}

exports.fetchUser = fetchUser;
exports.fetchMyOpenMergeRequests = fetchMyOpenMergeRequests;
exports.fetchOpenMergeRequestForCurrentBranch = fetchOpenMergeRequestForCurrentBranch;
exports.fetchLastPipelineForCurrentBranch = fetchLastPipelineForCurrentBranch;
exports.fetchCurrentProject = fetchCurrentProject;
exports._setGLToken = _setGLToken;
