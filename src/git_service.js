const vscode = require('vscode');
const execa = require('execa');

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
  const cmd = 'git rev-parse --abbrev-ref HEAD';

  return await fetch(cmd);
}

async function fetchLastCommitId() {
  const cmd = 'git log --format=%H -n 1';

  return await fetch(cmd);
}

exports.fetchBranchName = fetchBranchName;
exports.fetchLastCommitId = fetchLastCommitId;
