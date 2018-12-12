const vscode = require('vscode');
const moment = require('moment');
const gitLabService = require('../gitlab_service');
const { SidebarTreeItem } = require('../sidebar_tree_item');

class DataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    this.children = [];
    this.project = null;
    this.mr = null;
  }

  async fetchProject() {
    try {
      this.project = await gitLabService.fetchCurrentProject();
    } catch (e) {
      this.project = null;
      this.children.push(
        new SidebarTreeItem('No pipeline found.'),
        new SidebarTreeItem('No merge request found.'),
        new SidebarTreeItem('No closing issue found.'),
      );
    }
  }

  async fetchPipeline() {
    if (this.project) {
      const pipeline = await gitLabService.fetchLastPipelineForCurrentBranch();
      let message = 'No pipeline found.';
      let url = null;

      if (pipeline) {
        const statusText = pipeline.status === 'success' ? 'passed' : pipeline.status;
        const actions = {
          running: 'Started',
          pending: 'Created',
          success: 'Finished',
          failed: 'Failed',
          canceled: 'Canceled',
          skipped: 'Skipped',
        };
        const timeAgo = moment(pipeline.updated_at).fromNow();
        const actionText = actions[pipeline.status] || '';

        message = `Pipeline #${pipeline.id} ${statusText} · ${actionText} ${timeAgo}`;
        url = `${this.project.web_url}/pipelines/${pipeline.id}`;
      }

      this.children.push(new SidebarTreeItem(message, url));
    }
  }

  async fetchMR() {
    this.mr = null;

    if (this.project) {
      const mr = await gitLabService.fetchOpenMergeRequestForCurrentBranch();
      let message = 'No merge request found.';
      let url = null;

      if (mr) {
        this.mr = mr;
        message = `MR: !${mr.iid} · ${mr.title}`;
        url = mr.web_url;
      }

      this.children.push(new SidebarTreeItem(message, url));
    }
  }

  async fetchClosingIssue() {
    if (this.project) {
      if (this.mr) {
        const issues = await gitLabService.fetchMRIssues(this.mr.iid);

        if (issues.length) {
          issues.forEach(issue => {
            this.children.push(
              new SidebarTreeItem(`Issue: #${issue.iid} · ${issue.title}`, issue.web_url),
            );
          });
        } else {
          this.children.push(new SidebarTreeItem('No closing issue found.'));
        }
      } else {
        this.children.push(new SidebarTreeItem('No closing issue found.'));
      }
    }
  }

  async getChildren() {
    await this.fetchProject();
    await this.fetchPipeline();
    await this.fetchMR();
    await this.fetchClosingIssue();

    return this.children;
  }

  getParent() {
    return null;
  }

  getTreeItem(item) {
    return item;
  }

  refresh() {
    this.children = [];
    this._onDidChangeTreeData.fire();
  }
}

exports.DataProvider = DataProvider;
