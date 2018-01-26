const vscode = require('vscode');

// TODO: Provide user an option to delete PAT
async function showInput(context) {
  const token = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    password: true,
    placeHolder: 'Paste your GitLab Personal Access Token...',
  });

  if (token) {
    context.globalState.update('glToken', token);
  }
}

exports.showInput = showInput;
