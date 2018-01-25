const vscode = require('vscode');
const openLinks = require('./open_links');

const activate = (context) => {
  // console.log('Congratulations, your extension "gitlab-workflow" is now active!');

  const showIssues = vscode.commands.registerCommand('gl.showIssuesAssigedToMe', openLinks.showIssues);
  const showMergeRequests = vscode.commands.registerCommand('gl.showMergeRequestsAssigedToMe', openLinks.showMergeRequests);

  context.subscriptions.push(showIssues, showMergeRequests);

};

const deactivate = () => {};

exports.activate = activate;
exports.deactivate = deactivate;
