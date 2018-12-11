const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const gitLabService = require('./gitlab_service');

let context = null;

const addDeps = (ctx) => {
  context = ctx;
}

const getNonce = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const getResources = () => {
  const paths = {
    appScriptUri: 'src/webview/dist/js/app.js',
    vendorUri: 'src/webview/dist/js/chunk-vendors.js',
    styleUri: 'src/webview/dist/css/app.css',
    devScriptUri: 'src/webview/dist/app.js',
  }

  Object.keys(paths).forEach((key) => {
    const uri = vscode.Uri.file(path.join(context.extensionPath, paths[key]));

    paths[key] = uri.with({ scheme: 'vscode-resource' });
  });

  return paths;
}

const getIndexPath = () => {
  const isDev = !(fs.existsSync(path.join(context.extensionPath, 'src/webview/dist/js/app.js')));

  return isDev ? 'src/webview/public/dev.html' : 'src/webview/public/index.html';
}

const replaceResources = () => {
  const { appScriptUri, vendorUri, styleUri, devScriptUri } = getResources();

  return fs
    .readFileSync(path.join(context.extensionPath, getIndexPath()), 'UTF-8')
    .replace(/{{nonce}}/gm, getNonce())
    .replace('{{styleUri}}', styleUri)
    .replace('{{vendorUri}}', vendorUri)
    .replace('{{appScriptUri}}', appScriptUri)
    .replace('{{devScriptUri}}', devScriptUri);
}

const createPanel = (issuable) => {
  const title = `${issuable.title.slice(0, 20)}...`;

  return vscode.window.createWebviewPanel('glWorkflow', title, vscode.ViewColumn.One, {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, 'src')),
    ]
  });
}

async function create(issuable) {
  const panel = createPanel(issuable);
  const html = replaceResources();
  panel.webview.html = html;

  const discussions = await gitLabService.fetchDiscussions(issuable);

  panel.webview.postMessage({ type: 'issuableFetch', issuable, discussions });
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === 'renderMarkdown') {
      let rendered = await gitLabService.renderMarkdown(message.markdown);
      rendered = rendered.replace(/ src=".*" alt/gim, ' alt').replace(/" data-src/gim, '" src');

      panel.webview.postMessage({
        type: 'markdownRendered',
        ref: message.ref,
        key: message.key,
        markdown: rendered,
      });
    }
  });
}

exports.addDeps = addDeps;
exports.create = create;
