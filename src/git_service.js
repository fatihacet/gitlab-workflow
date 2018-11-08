const vscode = require('vscode');
const execa = require('execa');
const url = require('url');

const getWorkspaceRootPath = () => vscode.workspace.workspaceFolders[0].uri.fsPath;

async function fetch(cmd) {
  const [git, ...args] = cmd.split(' ');
  const output = await execa.stdout(git, args, {
    cwd: getWorkspaceRootPath(),
  });

  return output;
}

async function fetchBranchName() {
  const cmd = 'git rev-parse --abbrev-ref HEAD';
  const output = await fetch(cmd);

  return output;
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
    console.log(
      `Couldn't find tracking branch. Extension will fallback to branch name ${branchName}`,
    );
  }

  return branchName;
}

async function fetchLastCommitId() {
  const cmd = 'git log --format=%H -n 1';
  const output = await fetch(cmd);

  return output;
}

const parseGitRemote = remote => {
  if (remote.startsWith('git@') || remote.startsWith('git://')) {
    const match = new RegExp('^git(?:@|://)([^:/]+)(?::|:/|/)(.+)/(.+?)(?:.git)?$', 'i').exec(
      remote,
    );

    if (!match) {
      return null;
    }

    return ['git:', ...match.slice(1, 4)];
  }

  const { protocol = 'https:', hostname, pathname } = url.parse(remote);

  if (!hostname || !pathname) {
    return null;
  }

  const match = pathname.match(/\/(.+)\/(.*?)(?:.git)?$/);
  if (!match) {
    return null;
  }

  return [protocol, hostname, ...match.slice(1, 3)];
};

async function fetchRemoteUrl(name) {
  let remoteUrl = null;
  let remoteName = name;

  try {
    const branchName = await fetchBranchName();
    if (!remoteName) {
      remoteName = await fetch(`git config --get branch.${branchName}.remote`);
    }
    remoteUrl = await fetch(`git ls-remote --get-url ${remoteName}`);
  } catch (err) {
    try {
      remoteUrl = await fetch('git ls-remote --get-url');
    } catch (e) {
      const remote = await fetch('git remote');

      remoteUrl = await fetch(`git ls-remote --get-url ${remote}`);
    }
  }

  if (remoteUrl) {
    const [schema, domain, namespace, project] = parseGitRemote(remoteUrl);

    return { schema, domain, namespace, project };
  }

  return null;
}

async function fetchGitRemote() {
  const { remoteName } = vscode.workspace.getConfiguration('gitlab');

  return await fetchRemoteUrl(remoteName);
}

async function fetchGitRemotePipeline() {
  const { pipelineGitRemoteName } = vscode.workspace.getConfiguration('gitlab');

  return await fetchRemoteUrl(pipelineGitRemoteName);
}

exports.fetchBranchName = fetchBranchName;
exports.fetchTrackingBranchName = fetchTrackingBranchName;
exports.fetchLastCommitId = fetchLastCommitId;
exports.fetchGitRemote = fetchGitRemote;
exports.fetchGitRemotePipeline = fetchGitRemotePipeline;
