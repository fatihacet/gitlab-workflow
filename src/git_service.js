const vscode = require('vscode');
const execa = require('execa');
const url = require('url');

const getWorkspaceRootPath = () => {
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
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

/**
 * Fetches remote tracking branch name of current branch.
 * This should be used in link openers.
 *
 * Fixes #1 where local branch name is renamed and doesn't exists on remote but
 * local branch still tracks another branch on remote.
*/
async function fetchTrackingBranchName() {
  const branchName = await fetchBranchName();

  try {
    const cmd = `git config --get branch.${branchName}.merge`;
    const ref = await fetch(cmd);

    if (ref) {
      return ref.replace('refs/heads/', '');
    }
  } catch (e) {
    console.log(`Couldn't find tracking branch. Extension will fallback to branch name ${branchName}`);
  }

  return branchName;
}

async function fetchLastCommitId() {
  const cmd = 'git log --format=%H -n 1';

  return await fetch(cmd);
}

async function fetchGitRemote() {
  let url = null;

  try {
    const branchName = await fetchBranchName();
    const remoteName = await fetch(`git config --get branch.${branchName}.remote`);
    url = await fetch(`git ls-remote --get-url ${remoteName}`);
  } catch (e) {
    try {
      url = await fetch('git ls-remote --get-url');
    } catch (e) {
      const remote = await fetch('git remote');

      url = await fetch(`git ls-remote --get-url ${remote}`);
    }
  }

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
exports.fetchTrackingBranchName = fetchTrackingBranchName;
exports.fetchLastCommitId = fetchLastCommitId;
exports.fetchGitRemote = fetchGitRemote;
