const vscode = require('vscode');
const execa = require('execa');
const url = require('url');

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

async function fetchGitRemote() {
  const branchName = await fetchBranchName();
  const remoteName = await fetch(`git config --get branch.${branchName}.remote`);
  const url = await fetch(`git ls-remote --get-url ${remoteName} | cut -f 2 -d @ | cut -f 1 -d "/"`);

  if (url) {
    const [schema, domain, namespace, project] = parseGitRemote(url);

    return { schema, domain, namespace, project };
  }

  return null;
}

const parseGitRemote = (remote) => {
  if (remote.startsWith('git@') || remote.startsWith('git://')) {
    const match = new RegExp('^git(?:@|://)([^:/]+)(?::|:/|/)([^/]+)/(.+?)(?:.git)?$', 'i').exec(remote);

    if (!match) {
      return null;
    }

    return ['git:', ...match.slice(1, 4)];
  } else {
    const { protocol = 'https:', hostname, pathname } = url.parse(remote);

    if (!hostname || !pathname) {
      return null;
    }

    const match = pathname.match(/\/(.*?)\/(.*?)(?:.git)?$/);
    if (!match) {
      return null;
    }

    return [protocol, hostname, ...match.slice(1, 3)];
  }
}

exports.fetchBranchName = fetchBranchName;
exports.fetchLastCommitId = fetchLastCommitId;
exports.fetchGitRemote = fetchGitRemote;
