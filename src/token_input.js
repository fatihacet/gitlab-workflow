const vscode = require('vscode');
const extension = require('./extension');

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

const removeToken = context => {
  context.globalState.update('glToken', null);
  extension.deactivate();
};

exports.showInput = showInput;
exports.removeToken = removeToken;
