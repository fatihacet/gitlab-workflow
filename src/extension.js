const vscode = require('vscode');
const openLinks = require('./open_links');
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
    'gl.showIssuesAssigedToMe': openLinks.showIssues,
    'gl.showMergeRequestsAssigedToMe': openLinks.showMergeRequests,
    'gl.setToken': tokenInput.showInput.bind(null, context),
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

const deactivate = () => {};

exports.init = init;
exports.activate = activate;
exports.deactivate = deactivate;
