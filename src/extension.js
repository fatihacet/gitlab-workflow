const vscode = require('vscode');
const openers = require('./openers');
const tokenInput = require('./token_input');
const tokenService = require('./token_service');
const pipelineActionsPicker = require('./pipeline_actions_picker');
const searchInput = require('./search_input');
const snippetInput = require('./snippet_input');
const sidebar = require('./sidebar');
const ciConfigValidator = require('./ci_config_validator');
const IssuableDataProvider = require('./data_providers/issuable').DataProvider;

let context = null;
vscode.gitLabWorkflow = {
  sidebarDataProviders: [],
};

const registerCommands = () => {
  const commands = {
    'gl.showIssuesAssignedToMe': openers.showIssues,
    'gl.showMergeRequestsAssignedToMe': openers.showMergeRequests,
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
    'gl.refreshSidebar': sidebar.refresh,
  };

  Object.keys(commands).forEach(cmd => {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, commands[cmd]));
  });

  registerSidebarTreeDataProviders();
};

const registerSidebarTreeDataProviders = () => {
  const assignedIssuesDataProvider = new IssuableDataProvider({
    fetcher: 'fetchIssuesAssignedToMe',
  });

  const createdIssuesDataProvider = new IssuableDataProvider({
    fetcher: 'fetchIssuesCreatedByMe',
  });

  const assignedMrsDataProvider = new IssuableDataProvider({
    fetcher: 'fetchMergeRequestsAssignedToMe',
    issuableType: 'merge request',
  });

  const createdMrsDataProvider = new IssuableDataProvider({
    fetcher: 'fetchMergeRequestsCreatedByMe',
    issuableType: 'merge request',
  });

  const register = (name, provider) => {
    vscode.window.registerTreeDataProvider(name, provider);
    vscode.gitLabWorkflow.sidebarDataProviders.push(provider);
  }

  register('issuesAssignedToMe', assignedIssuesDataProvider);
  register('issuesCreatedByMe', createdIssuesDataProvider);
  register('mrsAssignedToMe', assignedMrsDataProvider);
  register('mrsCreatedByMe', createdMrsDataProvider);
}

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
