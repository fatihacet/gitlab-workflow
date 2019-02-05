const vscode = require('vscode');

class SidebarTreeItem extends vscode.TreeItem {
  constructor(title, data) {
    super(title);

    if (data) {
      let command = 'gl.showRichContent';
      let arg = data;

      if (data.sha) {
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
