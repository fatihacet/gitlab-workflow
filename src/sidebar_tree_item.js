const vscode = require('vscode');

class SidebarTreeItem extends vscode.TreeItem {
  constructor(title, url) {
    super(title);

    if (url) {
      this.command = {
        command: 'vscode.open',
        arguments: [vscode.Uri.parse(url)],
      }
    }
  }
}

exports.SidebarTreeItem = SidebarTreeItem;
