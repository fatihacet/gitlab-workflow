const vscode = require('vscode');
const opn = require('opn');
const openers = require('./openers');
const statusBar = require('./status_bar');
const tokenInput = require('./token_input');
const gitLabService = require('./gitlab_service');
const pipelineActionsPicker = require('./pipeline_actions_picker');
const searchInput = require('./search_input');
const snippetInput = require('./snippet_input');
const ciConfigValidator = require('./ci_config_validator');

let context = null;

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
    'gl.openCurrentPipeline': openers.openCurrentPipeline,
    'gl.pipelineActions': pipelineActionsPicker.showPicker,
    'gl.issueSearch': searchInput.showIssueSearchInput,
    'gl.mergeRequestSearch': searchInput.showMergeRequestSearchInput,
    'gl.compareCurrentBranch': openers.compareCurrentBranch,
    'gl.createSnippet': snippetInput.show,
    'gl.validateCIConfig': ciConfigValidator.validate,
  };

  Object.keys(commands).forEach(cmd => {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, commands[cmd]));
  });
};

const askForToken = () => {
  const gs = context.globalState;

  if (!gs.get('glToken') && !gs.get('askedForToken')) {
    const message =
      'GitLab Workflow: Please set GitLab Personal Access Token to setup this extension.';
    const setButton = { title: 'Set Token Now', action: 'set' };
    const readMore = { title: 'Read More', action: 'more' };

    gs.update('askedForToken', true);
    vscode.window.showInformationMessage(message, readMore, setButton).then(item => {
      if (item) {
        const { action } = item;

        if (action === 'set') {
          vscode.commands.executeCommand('gl.setToken');
        } else {
          opn('https://gitlab.com/fatihacet/gitlab-vscode-extension#setup');
        }
      }
    });
  }
};

const init = () => {
  const token = context.globalState.get('glToken');

  if (token) {
    gitLabService._setGLToken(token);
    statusBar.init(context);
  } else {
    askForToken();
  }
};

const activate = ctx => {
  context = ctx;
  registerCommands();
  init();
};

const deactivate = () => {
  statusBar.dispose();
};

exports.init = init;
exports.activate = activate;
exports.deactivate = deactivate;
