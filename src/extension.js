const vscode = require('vscode');
const openLinks = require('./open_links');
const statusBar = require('./status_bar');

const activate = (context) => {
  // console.log('To setup this extension, please add your GitLab User Id to settings file. ');

  const showIssues = vscode.commands.registerCommand('gl.showIssuesAssigedToMe', openLinks.showIssues);
  const showMergeRequests = vscode.commands.registerCommand('gl.showMergeRequestsAssigedToMe', openLinks.showMergeRequests);

  context.subscriptions.push(showIssues, showMergeRequests);

  statusBar.init(context);
};

const deactivate = () => {};

exports.activate = activate;
exports.deactivate = deactivate;
