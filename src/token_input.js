const vscode = require('vscode');
const extension = require('./extension');

// TODO: Provide user an option to delete PAT
async function showInput(context) {
  const token = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    password: true,
    placeHolder: 'Paste your GitLab Personal Access Token...',
  });

  if (token) {
    context.globalState.update('glToken', token);
    extension.init();
  }
}

exports.showInput = showInput;
