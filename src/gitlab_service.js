const vscode = require('vscode');
const opn = require('opn');
const request = require('request-promise');
const gitService = require('./git_service');
const tokenService = require('./token_service');
const statusBar = require('./status_bar');

let branchMR = null;

async function fetch(path, method = 'GET', data = null) {
  const { instanceUrl } = vscode.workspace.getConfiguration('gitlab');
  const apiRoot = `${instanceUrl}/api/v4`;
  const glToken = tokenService.getToken(instanceUrl);

  if (!glToken) {
    return vscode.window.showInformationMessage(
      'GitLab Workflow: Cannot make request. No token found.',
    );
  }

  const config = {
    url: `${apiRoot}${path}`,
    method,
    headers: {
      'PRIVATE-TOKEN': glToken,
    },
  };

  if (data) {
    config.formData = data;
  }

  const response = await request(config);

  try {
    return JSON.parse(response);
  } catch (e) {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to perform your operation.');
    console.log('Failed to execute fetch', e);
    return { error: e };
  }
}

async function fetchCurrentProject() {
  const remote = await gitService.fetchGitRemote();

  if (remote) {
    const { namespace, project } = remote;
    const projectData = await fetch(`/projects/${namespace.replace(/\//g, '%2F')}%2F${project}`);

    return projectData || null;
  }

  return null;
}

async function fetchUser(userName) {
  let user = null;

  try {
    const path = userName ? `/user?search=${userName}` : '/user';

    user = await fetch(path);
  } catch (e) {
    let message = 'GitLab Workflow: GitLab user not found.';

    if (!userName) {
      message += ' Check your Personal Access Token.';
    }

    vscode.window.showInformationMessage(message);
  }

  return user;
}

async function fetchMyOpenMergeRequests() {
  const project = await fetchCurrentProject();
  let mrs = [];

  if (project) {
    const path = `/projects/${project.id}/merge_requests?scope=created-by-me&state=opened`;
    mrs = await fetch(path);
  }

  return mrs;
}

async function fetchLastPipelineForCurrentBranch() {
  const project = await fetchCurrentProject();
  let pipeline = null;

  if (project) {
    const branchName = await gitService.fetchTrackingBranchName();
    const pipelinesRootPath = `/projects/${project.id}/pipelines`;
    const pipelines = await fetch(`${pipelinesRootPath}?ref=${branchName}`);

    if (pipelines.length) {
      pipeline = await fetch(`${pipelinesRootPath}/${pipelines[0].id}`);
    }
  }

  return pipeline;
}

/**
 * GitLab API doesn't support getting open MR by commit ID or branch name.
 * Using this recursive fetcher method, we fetch 100 MRs at a time and do pagination
 * until we find the MR for current branch. This method will retry max 5 times.
 */
async function fetchOpenMergeRequestForCurrentBranch() {
  if (branchMR) {
    return branchMR;
  }

  const project = await fetchCurrentProject();
  const branchName = await gitService.fetchTrackingBranchName();
  let page = 1;

  // Recursive fetcher method to find the branch MR in MR list.
  async function fetcher() {
    const path = `/projects/${project.id}/merge_requests?state=opened&per_page=100&page=${page}`;
    const mrs = await fetch(path);
    const [mr] = mrs.filter(m => m.source_branch === branchName);

    if (mr) {
      if (page > 1) {
        // Cache only if we need to do pagination.
        branchMR = mr;
      }

      return mr;
    }

    if (page <= 5 && mrs.length === 100) {
      // Retry max 5 times.
      page += 1;
      return await fetcher();
    }

    return null;
  }

  return project ? await fetcher() : null;
}

/**
 * Cancels or retries last pipeline or creates a new pipeline for current branch.
 *
 * @param {string} action create|retry|cancel
 */
async function handlePipelineAction(action) {
  const pipeline = await fetchLastPipelineForCurrentBranch();
  const project = await fetchCurrentProject();

  if (pipeline && project) {
    let endpoint = `/projects/${project.id}/pipelines/${pipeline.id}/${action}`;
    let newPipeline = null;

    if (action === 'create') {
      const branchName = await gitService.fetchTrackingBranchName();
      endpoint = `/projects/${project.id}/pipeline?ref=${branchName}`;
    }

    try {
      newPipeline = await fetch(endpoint, 'POST');
    } catch (e) {
      vscode.window.showErrorMessage(`GitLab Workflow: Failed to ${action} pipeline.`);
    }

    if (newPipeline) {
      opn(`${project.web_url}/pipelines/${newPipeline.id}`);
      statusBar.refreshPipelines();
    }
  } else {
    vscode.window.showErrorMessage('GitLab Workflow: No project or pipeline found.');
  }
}

async function fetchMRIssues(mrId) {
  const project = await fetchCurrentProject();
  let issues = [];

  if (project) {
    try {
      issues = await fetch(`/projects/${project.id}/merge_requests/${mrId}/closes_issues`);
    } catch (e) {
      console.log('Failed to execute fetchMRIssue', e);
    }
  }

  return issues;
}

async function createSnippet(data) {
  let snippet;

  try {
    snippet = await fetch(`/projects/${data.id}/snippets`, 'POST', data);
  } catch (e) {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to create your snippet.');
  }

  return snippet;
}

async function validateCIConfig(content) {
  let response = null;

  try {
    response = await fetch('/ci/lint', 'POST', { content });
  } catch (e) {
    vscode.window.showInformationMessage('GitLab Workflow: Failed to validate CI configuration.');
  }

  return response;
}

exports.fetchUser = fetchUser;
exports.fetchMyOpenMergeRequests = fetchMyOpenMergeRequests;
exports.fetchOpenMergeRequestForCurrentBranch = fetchOpenMergeRequestForCurrentBranch;
exports.fetchLastPipelineForCurrentBranch = fetchLastPipelineForCurrentBranch;
exports.fetchCurrentProject = fetchCurrentProject;
exports.handlePipelineAction = handlePipelineAction;
exports.fetchMRIssues = fetchMRIssues;
exports.createSnippet = createSnippet;
exports.validateCIConfig = validateCIConfig;
