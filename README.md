# <img src="https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/logo.png" width="64" align="center" /> [GitLab VSCode Extension](https://gitlab.com/fatihacet/gitlab-vscode-extension)

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/fatihacet.gitlab-workflow.svg)](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow) [![Installs](https://vsmarketplacebadge.apphb.com/installs/fatihacet.gitlab-workflow.svg)](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow)

This extension integrates GitLab to VSCode by adding a new GitLab sidebar where you can find issues and merge requests created by you or assigned to you. It also extends VSCode command palette and status bar to provide more information about your project.


## Screencast

[![video-cover](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/screencast-cover.jpg)](https://www.youtube.com/watch?v=XcxsF0lWBhA)


## Features

- See your issues and MRs on a dedicated panel in the VSCode sidebar. [Read more](#sidebar)
- See pipeline status, open MR and closing issue links in the status bar. [Read more](#status-bar).
- Automatically updates pipeline status on the status bar so you don't need to open GitLab to see your pipeline status.
- Advanced pipeline actions allow you to view pipeline on GitLab, create a new pipeline, retry or cancel current pipeline. [Read more](#pipeline-actions).
- Issue and MR search including simple and advanced search. [Read more](#advanced-search).
- View MR and closing issue on GitLab with a single click from your status bar.
- Create public, internal or private snippet from entire file or selection. [Read more](#create-snippet).
- Compare your branch with master and view changes on GitLab. [Read more](#compare-with-master).
- View active file on GitLab with highlighting active line number and selected text block. [Read more](#open-active-file).
- Validate GitLab CI configuration file `.gitlab-ci.yml`. [Read more](#validate-gitlab-ci-configuration).
- Open MR of current branch on GitLab.
- Open issues assigned to you on GitLab.
- Open MRs assigned to you on GitLab.
- Open pipeline on GitLab.
- Open project on GitLab.
- Open issue page to create a new issue.
- Open the merge request page to create a merge request.
- Set and remove your GitLab Personal Access Token. _Required step, see [Setup](#setup) section below._
- Supports multiple GitLab instances [Read more](#multiple-gitlab-instances).

**Curious to know what's next?** [See here](#whats-next)


## Setup

To use this extension, you need to create a GitLab Personal Access Token and give it to the extension.

##### Step 1: Create your Personal Access Token
- If you are using
  - GitLab.com [click to open Personal Access Tokens page](https://gitlab.com/profile/personal_access_tokens).
  - Self-hosted GitLab instance go to "Settings" and click "Access Tokens" on the left navigation menu
- On "Add a personal access token" form
  - Give a name to your token.
  - Select and expiry date.
  - Select "api" and "read_user" permissions.
  - Hit "Create personal access token" button.
- Copy the token. _Remember you won't be able to see the value of this token ever again for security reasons._

##### Step 2: Add token to GitLab Workflow Extension
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for "GitLab: Set GitLab Personal Access Token" and hit Enter.
- Enter the URL to the Gitlab instance the PAT should apply to and hit Enter.
- Extension will ask for your PAT. Paste your PAT and hit Enter. _It won't be visible and accessible to others._

That's it. 🏁

You can start using this extension right away. If your project has a pipeline for last commit and a MR from your current branch, you should see them on VSCode status bar. 🎉

#### Multiple Gitlab instances

If you want to use multiple GitLab instances you may want to configure each workspace separately. See `gitlab.instanceUrl` config option in [Configuration Options](#configuration-options) section.


## Configuration options

**`gitlab.instanceUrl`** _(required: false, default: "https://gitlab.com")_

If you are using GitLab on a custom domain, you should add this to your user settings file. Example: `"gitlab.instanceUrl": "https://my-gitlab-domain.com"`

To enable Gitlab Workflow extension to work with different Gitlab instances, each token is assigned to a Gitlab instance URL. For the extension to selected the correct token for a specific workspace, the option [`gitlab.instanceUrl`](#configuration-options) can be used. This option can be set in the current workspace's `.vscode/settings.json` file.

**`gitlab.showStatusBarLinks`** _(required: false, default: true)_

If you don't want to see GitLab related links on the status bar, you can set this option to `false`. If you are using version 1.0.0 or above you can also find the same links in sidebar. You should restart your VSCode after updating this option.

**`gitlab.showIssueLinkOnStatusBar`** _(required: false, default: true)_

If you are not using GitLab's issue tracker, you can set this option to `false` to remove related issue link on the status bar. You should restart your VSCode after updating this option.

**`gitlab.showMrStatusOnStatusBar`** _(required: false, default: true)_

You can toggle visibility of MR link in your sidebar. You can always find MR link in GitLab Workflow sidebar. You should restart your VSCode after updating this option.

**`gitlab.ca`** _(required: false, default: null)_

If your self-hosted GitLab instance has a self-signed SSL certificate you would probably need to set this option in to point your certificate file. More discussion can be found [in this issue](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/26).

**`gitlab.ignoreCertificateErrors`**  _(required: false, default: false)_

If you are using a self-hosted GitLab instance with no SSL certificate or having certificate issues and unable to use the extension you may want to set this option to `true` to ignore certificate errors. More information can be found [here](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/26#note_61312786).

> You can open User Settings file by pressing `Cmd+,` on Mac OS or following `Code > Preferences > User Settings`. You can simply add extension configuration values to your User Settings file. This won't break or change anything on your VSCode.

**`gitlab.remoteName`** _(required: false, default: null)_

The name of the git remote link corresponding to the GitLab repositiory with your MR and issues. If no setting is provided, the extension will detect it. For example: origin.

**`gitlab.pipelineGitRemoteName`** _(required: false, default: null)_

The name of the git remote link corresponding to the GitLab repositiory with your pipelines. If no setting is provided, the extension will detect it. For example: origin.

## Usage
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for `GitLab:` and you will see all the commands provided by the extension.

![https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png)

![https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/pipeline-actions.png](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/pipeline-actions.png)


## Features in-depth


### Sidebar
Extension will add a GitLab Workflow panel to sidebar of your VSCode. The dedicated panel will allow you to see the list of your issues and MRs. Also you will be able to see pipeline, MR and issue links for your current branch.

In the current version, clicking the links will open them on your default browser but the next version will allow you to interact with your issues and MRs right in your VSCode. With the upcoming versions, the extension will allow you to see the MR changes and discussions in VSCode.

![_sidebar.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_sidebar.gif)


### Pipeline actions
One of the real power features of this extension is pipeline actions. This feature can be accessible from the status bar by clicking the pipeline status text or command palette and allows you to,

- View the latest pipeline on GitLab
- Create a new pipeline for your current branch
- Retry the last pipeline
- Cancel the last pipeline

![_pipeline_actions.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_pipeline_actions.gif)


### Status bar
If your current project is a GitLab project, the extension will do the following things:

- Fetch pipeline of the last commit and show it on the status bar. Clicking this item will open the pipeline actions menu.
- Show open MR for current branch and show it on the status bar. Clicking this item will open MR on GitLab.
- Fetch closing issue of that MR and show it on the status bar. Clicking this item will open Issue on GitLab.

![_status_bar.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_status-bar.gif)


### Advanced Search
GitLab Workflow extension provides you two types of search. Basic and advanced search. Basic search is quick however advanced search is more powerful which allows you to filter issues by author, assignee, milestone, title etc.

To use the basic search, in the search input, you can type your search term and hit Enter. This will search issues/MRs against their title and description fields. Example: `Inconsistent line endings for HEX files` or `Pipelines should ignore retried builds`.

You can perform advanced issue/MR search by using some predefined tokens. Full list below.

|Token|Description|Example|
|-|-|-|
|title|Search issues/MRs against their title and description. You don't need to add quotes around multiple words. See Important notes section.|discussions refactor|
|labels|Comma separated label list for multiple labels.|`labels: frontend, Discussion, performance`|
|label|To search with a single label. You can also have multiple `label` tokens.|`label: frontend` or `label:frontend label: Discussion`
|milestone|Milestone title without `%`.|`milestone: 9.5`|
|scope|Searches issues/MRs for the given scope. Values can be `created-by-me`, `assigned-to-me` or `all`. Defaults to `created-by-me`.|`scope: created-by-me` or `scope: assigned-to-me` or `scope: all`.|
|author|Username of the author without `@`.|`author: fatihacet`|
|assignee|Username of the assignee without `@`.|`assignee: timzallmann`|

**Examples**
- `title: new merge request widget author: fatihacet assignee: jschatz1 labels: frontend, performance milestone: 10.5`
- `title: multiple group page author: annabeldunstone assignee: timzallmann label: frontend`

**Important notes**
- `:` after the token name is necessary. `label :` is not a valid token name and may return parsing error. Hence `label:` should be used. However, space after the token name is optional. Both `label: frontend` and `label:frontend` is valid. This rule is valid for all tokens above.
- You don't need to add quotes around multiple words for `title` token. `title:"new merge request widget"` may return parsing error. `title: new merge request widget` should be used.
- You can have `labels` and `label` tokens at the same time. `labels: fronted discussion label: performance` is a valid query and all labels will be included in your search query. It's equal with `labels: fronted discussion performance`. You can also have multiple `label` tokens. `label: frontend label: discussion label: performance` is valid and equals to `labels: fronted discussion performance`.

![_advanced-search.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_advanced-search.gif)


### Create snippet
You can create a snippet from selection or entire file. You can also select visibility level of your snippet.

![_create-snippet.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_create-snippet.gif)


### Compare with master
You can see changes in your branch by comparing with `master` and see them on GitLab.

![_compare-with-master.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_compare-with-master.gif)

> Soon extension will support comparing your current branch with other branches.


### Open active file
This command allows you to see active file on GitLab. Extension sends active line number and selected text block to GitLab UI so you can see them highlighted.

![_open_active_file.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_open_active_file.gif)


### Validate GitLab CI Configuration
Using this command, you can quickly validate GitLab CI configuration.

![_validate-ci-config.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_validate-ci-config.gif)

-----

### Caveats and known issues
- The current version of the extension doesn't support multi-root workspaces. It's planned for the 1.0 major version.


## What's next?
- Open last commit on GitLab.
- MR actions picker which will allow you to
  - Go to specific MR tab, Discussions, Commits, Pipelines, Changes.
  - Assign MR to user.
  - View the last commit.
- **[moonshot]** MR diff discussions on VSCode gutter with user avatars like we have in GitLab Changes tab.
- **Already Shipped**
  - `[v0.2.2]` Pipeline link to pipeline status bar item.
  - `[v0.2.2]` View last pipeline on GitLab.
  - `[v0.3.0]` Pipeline actions menu to quickly view, retry, cancel or create a new pipeline.
  - `[v0.4.0]` Issue and MR search.
  - `[v0.4.0]` Detailed issue and MR search.
  - `title:MR discussions refactor labels:frontend, discussions assignee:fatihacet`
  - `[v0.4.0]` Compare your changes with master on GitLab.
  - `[v0.5.0]` Create snippet from selected text
  - `[v0.5.0]` GitLab CI config file `(.gitlab-ci.yml)` validation


## Contribution
This extension is open source and [hosted on GitLab](https://gitlab.com/fatihacet/gitlab-vscode-extension). Contributions are more than welcome. Feel free to fork and add new features or submit bug reports.

[Here](https://gitlab.com/fatihacet/gitlab-vscode-extension/blob/master/CONTRIBUTORS.md) is the list of great people who contributed this project and make it even more awesome. Thank you all 🎉
