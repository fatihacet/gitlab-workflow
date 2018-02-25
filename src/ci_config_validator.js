const vscode = require('vscode');
const gitLabService = require('./gitlab_service');

const { showInformationMessage, showErrorMessage } = vscode.window;

async function validate() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return showInformationMessage('GitLab Workflow: No open file.');
  }

  const content = editor.document.getText();
  const response = await gitLabService.validateCIConfig(content);

  if (!response) {
    return showInformationMessage('GitLab Workflow: Failed to validate CI configuration.');
  }

  const { status, errors, error } = response;

  if (status === 'valid') {
    showInformationMessage('GitLab Workflow: Your CI configuration is valid.');
  } else if (status === 'invalid') {
    if (errors[0]) {
      showErrorMessage(errors[0]);
    }

    showErrorMessage('GitLab Workflow: Invalid CI configuration.');
  } else if (error) {
    showErrorMessage(`GitLab Workflow: Failed to validate CI configuration. Reason: ${error}`);
  }
}

exports.validate = validate;
