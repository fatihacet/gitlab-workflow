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

/**
 * GitLab API doesn't support getting open MR by commit ID or branch name.
 * Using this recursive fetcher method, we fetch 100 MRs at a time and do pagination
 * until we find the MR for current branch. This method will retry max 5 times.
 */
async function fetchOpenMergeRequestForCurrentBranch() {
  const project = await fetchCurrentProject();
  const branchName = await gitService.fetchTrackingBranchName();
  let page = 1;

  // Recursive fetcher method to find the branch MR in MR list.
  async function fetcher() {
    const mrs = await fetch(`/projects/${project.id}/merge_requests?state=opened&per_page=100&page=${page}`);

    const [mr] = mrs.filter((mr) => {
      return mr.source_branch === branchName;
    });

    if (mr) {
      return mr;
    }

    if (page <= 5) { // Retry max 5 times.
      page = page + 1;
      return await fetcher();
    }
  }

  return project ? await fetcher() : null;
}

/**
 * @private
 * @param {string} token GL PAT
 */
const _setGLToken = (token) => {
  glToken = token;
}

exports.fetchUser = fetchUser;
exports.fetchMyOpenMergeRequests = fetchMyOpenMergeRequests;
exports.fetchOpenMergeRequestForCurrentBranch = fetchOpenMergeRequestForCurrentBranch;
exports.fetchLastPipelineForCurrentBranch = fetchLastPipelineForCurrentBranch;
exports.fetchCurrentProject = fetchCurrentProject;
exports._setGLToken = _setGLToken;
