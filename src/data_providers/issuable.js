const vscode = require('vscode');
const gitLabService = require('../gitlab_service');
const { SidebarTreeItem } = require('../sidebar_tree_item');

class DataProvider {
  constructor({ fetcher, issuableType, noItemText }) {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    this.fetcher = fetcher;
    this.issuableSign = issuableType === 'merge_request' ? '!' : '#';
    this.noItemText = noItemText || 'Nothing to show.';
  }

  async getChildren() {
    const items = [];
    const issues = await gitLabService[this.fetcher]();

    if (issues.length) {
      issues.forEach(issue => {
        const title = `${this.issuableSign}${issue.iid} · ${issue.title}`;

        items.push(new SidebarTreeItem(title, issue));
      });
    } else {
      items.push(new SidebarTreeItem(this.noItemText));
    }

    return items;
  }

  getParent() {
    return null;
  }

  getTreeItem(item) {
    return item;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

exports.DataProvider = DataProvider;
