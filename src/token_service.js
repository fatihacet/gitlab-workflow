const vscode = require('vscode');
const opn = require('opn');
const statusBar = require('./status_bar');

let context = null;
let active = false;

const init = (ctx) => {
  context = ctx;

  migrateLegacyToken();
  
  askForToken();
  updateExtensionStatus();
  watchConfigurationChanges();
}

const getToken = (instanceUrl = currentInstanceUrl()) => {
  return getGlTokenMap()[instanceUrl];
}

const setToken = (instanceUrl, token) => {
  const tokenMap = getGlTokenMap();

  if (token) {
    tokenMap[instanceUrl] = token;
  } else {
    delete tokenMap[instanceUrl];
  }

  context.globalState.update('glTokens', tokenMap);
  updateExtensionStatus();
}

const getInstanceUrls = () => {
  return Object.keys(getGlTokenMap());
}

const updateExtensionStatus = () => {
  const tokenExists = !!getToken();

  if (!active && tokenExists) {
    statusBar.init(context);
    active = true;
  } else if (active && !tokenExists) {
    statusBar.dispose();
    active = false;
  }
}

const watchConfigurationChanges = () => {
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('gitlab')) {
      updateExtensionStatus();
    }
  });
}

const migrateLegacyToken = () => {
  const token = context.globalState.get('glToken');
  
  if (token) {
    const instanceUrl = currentInstanceUrl();

    if (!getToken(instanceUrl)) {
      setToken(instanceUrl, token);
    }
    
    context.globalState.update('glToken', null);
  }
}

const currentInstanceUrl = () => {
  return vscode.workspace.getConfiguration('gitlab').instanceUrl;
}

const getGlTokenMap = () => {
  return context.globalState.get('glTokens', {});
}

const askForToken = () => {
  if (!getToken() && !context.workspaceState.get('askedForToken')) {
    const message = 'GitLab Workflow: Please set GitLab Personal Access Token to setup this extension.';
    const setButton = { title: 'Set Token Now', action: 'set' };
    const readMore = { title: 'Read More', action: 'more' };

    context.workspaceState.update('askedForToken', true);
    vscode.window.showInformationMessage(message, readMore, setButton)
      .then((item) => {
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
}

exports.init = init;
exports.getToken = getToken;
exports.setToken = setToken;
exports.getInstanceUrls = getInstanceUrls;
