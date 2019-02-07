const vscode = require('vscode');

class SidebarTreeItem extends vscode.TreeItem {
  constructor(title, data) {
    super(title);

    const { enableExperimentalFeatures } = vscode.workspace.getConfiguration('gitlab');

    if (data) {
      let command = 'gl.showRichContent';
      let arg = data;

      if (data.sha || !enableExperimentalFeatures) {
        command = 'vscode.open';
        arg = vscode.Uri.parse(data.web_url);
      }

      this.command = {
        command,
        arguments: [arg],
      };
    }
  }
}

exports.SidebarTreeItem = SidebarTreeItem;
