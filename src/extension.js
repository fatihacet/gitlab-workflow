const vscode = require('vscode');
const openers = require('./openers');
const tokenInput = require('./token_input');
const tokenService = require('./token_service');
const pipelineActionsPicker = require('./pipeline_actions_picker');
const searchInput = require('./search_input');
const snippetInput = require('./snippet_input');
const ciConfigValidator = require('./ci_config_validator');

let context = null;

const registerCommands = () => {
  const commands = {
    'gl.showIssuesAssigedToMe': openers.showIssues,
    'gl.showMergeRequestsAssigedToMe': openers.showMergeRequests,
    'gl.setToken': tokenInput.showInput,
    'gl.removeToken': tokenInput.removeTokenPicker,
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

const init = () => {
  tokenService.init(context);
};

const activate = ctx => {
  context = ctx;
  registerCommands();
  init();
};

exports.init = init;
exports.activate = activate;
