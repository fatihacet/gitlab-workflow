const vscode = require('vscode');
const openers = require('./openers');
const statusBar = require('./status_bar');
const tokenInput = require('./token_input');
const gitLabService = require('./gitlab_service');

let context = null;

const activate = (ctx) => {
  context = ctx;
  registerCommands();
  init();
};

const registerCommands = () => {
  const commands = {
    'gl.showIssuesAssigedToMe': openers.showIssues,
    'gl.showMergeRequestsAssigedToMe': openers.showMergeRequests,
    'gl.setToken': tokenInput.showInput.bind(null, context),
    'gl.removeToken': tokenInput.removeToken.bind(null, context),
    'gl.openActiveFile': openers.openActiveFile,
    'gl.openCurrentMergeRequest': openers.openCurrentMergeRequest,
    'gl.openCreateNewIssue': openers.openCreateNewIssue,
    'gl.openCreateNewMR': openers.openCreateNewMr,
    'gl.openProjectPage': openers.openProjectPage,
  }

  Object.keys(commands).forEach((cmd) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(cmd, commands[cmd])
    );
  });
};

const init = () => {
  const token = context.globalState.get('glToken');

  if (token) {
    gitLabService._setGLToken(token);
    statusBar.init(context);
  } else {
    askForToken();
  }
}

const askForToken = () => {
  const gs = context.globalState;

  if (!gs.get('glToken') && !gs.get('askedForToken')) {
    vscode.window.showInformationMessage('GitLab Workflow: Please set GitLab Personal Access Token to setup this extension.');
    gs.update('askedForToken', true);
  }
}

const deactivate = () => {
  statusBar.dispose();
};

exports.init = init;
exports.activate = activate;
exports.deactivate = deactivate;
