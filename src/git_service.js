const vscode = require('vscode');
const execa = require('execa');

const store = {};

const getWorkspaceRootPath = () => {
  return vscode.workspace.rootPath;
}

async function fetch(cmd) {
  const [git, ...args] = cmd.split(' ');

  return await execa.stdout(git, args, {
    cwd: getWorkspaceRootPath(),
  });
}

async function fetchBranchName() {
  if (store.branchName) {
    return store.branchName;
  }

  const cmd = 'git rev-parse --abbrev-ref HEAD';
  const branchName = await fetch(cmd);
  store.branchName = branchName;

  return branchName;
}

async function fetchLastCommitId() {
  if (store.lastCommitId) {
    return store.lastCommitId;
  }

  const cmd = 'git log --format=%H -n 1';
  const lastCommitId = await fetch(cmd);
  store.lastCommitId = lastCommitId;

  return lastCommitId;
}

exports.fetchBranchName = fetchBranchName;
exports.fetchLastCommitId = fetchLastCommitId;
