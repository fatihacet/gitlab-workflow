const vscode = require('vscode');

class SidebarTreeItem extends vscode.TreeItem {
  constructor(title, data) {
    super(title);

    if (data) {
      this.command = {
        command: 'gl.showRichContent',
        arguments: [data],
      }
    }
  }
}

exports.SidebarTreeItem = SidebarTreeItem;
