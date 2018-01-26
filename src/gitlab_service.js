const request = require('request-promise');
const gitService = require('./git_service');
const apiRoot = 'https://gitlab.com/api/v4'; // FIXME: Get domain dynamically

async function fetch(path) {
  const config = {
    url: `${apiRoot}${path}`,
    headers: {
      'PRIVATE-TOKEN': 'TOKEN', // FIXME
    }
  };

  const response = await request(config);

  try {
    return JSON.parse(response);
  } catch (e) {
    return { error: e };
  }
}

// FIXME: Don't rely created-by-me
// FIXME: Fix project id
async function fetchMyOpenMergeRequests() {
  return await fetch('/projects/13083/merge_requests?scope=created-by-me&state=opened');
}

async function fetchOpenMergeRequestForCurrentBranch() {
  const branchName = await gitService.fetchBranchName();
  const mrs = await fetchMyOpenMergeRequests(); // FIXME: I doesn't have to be my MR

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

exports.fetchMyOpenMergeRequests = fetchMyOpenMergeRequests;
exports.fetchOpenMergeRequestForCurrentBranch = fetchOpenMergeRequestForCurrentBranch;
exports.fetchLastPipelineForCurrentBranch = fetchLastPipelineForCurrentBranch;
