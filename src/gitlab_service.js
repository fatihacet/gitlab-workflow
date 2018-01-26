const request = require('request-promise');
const gitService = require('./git_service');
const apiRoot = 'https://gitlab.com/api/v4'; // FIXME: Get domain dynamically

async function fetch(path) {
  const config = {
    url: `${apiRoot}${path}`,
    headers: {
      'PRIVATE-TOKEN': 'f9vX_GfmWc_SLzz7Siaq', // FIXME: Make token UI
    }
  };

  const response = await request(config);

  try {
    return JSON.parse(response);
  } catch (e) {
    return { error: e };
  }
}

// FIXME: Don't rely on `created-by-me`. It doesn't have to be my own MR.
// Currently GL API doesn't support finding MR by branch name or commit id.
async function fetchMyOpenMergeRequests() {
  const project = await fetchCurrentProject();

  if (project) {
    return await fetch(`/projects/${project.id}/merge_requests?scope=created-by-me&state=opened`);
  }

  return null;
}

async function fetchOpenMergeRequestForCurrentBranch() {
  const branchName = await gitService.fetchBranchName();
  const mrs = await fetchMyOpenMergeRequests();

  return mrs.filter(mr => mr.source_branch === branchName)[0];
}

async function fetchLastPipelineForCurrentBranch() {
  const mr = await fetchOpenMergeRequestForCurrentBranch();

  if (mr) {
    const path = `/projects/${mr.target_project_id}/pipelines`;
    const branchName = await gitService.fetchBranchName();
    const pipelines = await fetch(`${path}?ref=${branchName}`);

    if (pipelines.length) {
      return await fetch(`${path}/${pipelines[0].id}`);
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

exports.fetchMyOpenMergeRequests = fetchMyOpenMergeRequests;
exports.fetchOpenMergeRequestForCurrentBranch = fetchOpenMergeRequestForCurrentBranch;
exports.fetchLastPipelineForCurrentBranch = fetchLastPipelineForCurrentBranch;
exports.fetchCurrentProject = fetchCurrentProject;
