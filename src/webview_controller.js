const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

let context = null;

const addDeps = (ctx) => {
  context = ctx;
}

const getNonce = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

async function create(issuable) {
  const panel = vscode.window.createWebviewPanel('glWorkflow', 'GL Workflow', vscode.ViewColumn.One, {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, 'src'))
    ]
  });

  const isDev = !(fs.existsSync(path.join(context.extensionPath, 'src/webview/dist/js/app.js')));
  const indexPath = isDev ? 'src/webview/public/dev.html' : 'src/webview/public/index.html';

  const { appScriptUri, vendorUri, styleUri, devScriptUri } = getResources();
  let html = fs.readFileSync(path.join(context.extensionPath, indexPath), 'UTF-8');

  html = html.replace(/{{nonce}}/gm, getNonce())
          .replace('{{styleUri}}', styleUri)
          .replace('{{vendorUri}}', vendorUri)
          .replace('{{appScriptUri}}', appScriptUri)
          .replace('{{devScriptUri}}', devScriptUri);

  panel.webview.html = html;
}

exports.addDeps = addDeps;
exports.create = create;
