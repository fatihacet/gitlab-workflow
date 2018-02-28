const vscode = require('vscode');
const gitLabService = require('./gitlab_service');

const { showInformationMessage, showErrorMessage } = vscode.window;

async function validate() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    showInformationMessage('GitLab Workflow: No open file.');
    return;
  }

  const content = editor.document.getText();
  const response = await gitLabService.validateCIConfig(content);

  if (!response) {
    showInformationMessage('GitLab Workflow: Failed to validate CI configuration.');
    return;
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
