# <img src="https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/logo.png" width="64" /> [GitLab VSCode Extension](https://gitlab.com/fatihacet/gitlab-vscode-extension)

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/fatihacet.gitlab-workflow.svg)](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow) [![Installs](https://vsmarketplacebadge.apphb.com/installs/fatihacet.gitlab-workflow.svg)](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow)

This extension integrates GitLab to VSCode by adding GitLab specific options to VSCode command palette and status bar.


## Features

- See pipeline status, open MR and closing issue links in status bar. [Read more](#status-bar).
- Automatically updates pipeline status on status bar so you don't need to open GitLab to see your pipeline status.
- Advanced pipeline actions allows you to view pipeline on GitLab, create new pipeline, retry or cancel current pipeline. [Read more](#pipeline-actions).
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
- Open merge request page to create a merge request.
- Set and remove your GitLab Personal Access Token. _Required, see Setup section below._

**Curious to know what's next?** [See here](#whats-next)


## Setup

To use this extension, you need to create a GitLab Personal Access Token and give it to the extension.

##### Step 1: Create your Personal Access Token
- If you are using
  - GitLab.com [click to open Personal Access Tokens page](https://gitlab.com/profile/personal_access_tokens).
  - Self hosted GitLab instance go to "Settings" and click "Access Tokens" on the left navigation menu
- On "Add a personal access token" form
  - Give a name to your token.
  - Select and expiry date.
  - Select "api" and "read_user" permissions.
  - Hit "Create personal access token" button.
- Copy the token. _Remember you won't be able to see value of this token ever again for security reasons._

##### Step 2: Add token to GitLab Workflow Extension
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for "GitLab: Set GitLab Personal Access Token" and hit Enter.
- Extension will ask for your PAT. Paste your PAT and hit Enter. _It won't be visible and accessible to others._

That's it. 🏁

You can start using this extension right away. If your project has a pipeline for last commit and a MR from your current branch, you should see them on VSCode status bar. 🎉


## Usage
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for `GitLab:` and you will see all commands provided by the extension.

![https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png)

![https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/pipeline-actions.png](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/pipeline-actions.png)


## Features in depth

### Advanced Search
GitLab Workflow extension provides you two types of search. Basic and advanced search. Basic search is quick however advanced search is more powerful which allows you to filter issues by author, assignee, milestone, title etc.

To use basic search, in the search input, you can type your search term and hit Enter. This will search issues/MRs against their title and description fields. Example: `Inconsistent line endings for HEX files` or `Pipelines should ignore retried builds`.

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
- `:` after token name is necessary. `label :` is not a valid token name and may return parsing error. Hence `label:` should be used. However space after token name is optional. Both `label: frontend` and `label:frontend` is valid. This rule is valid for all tokens above.
- You don't need to add quotes around multiple words for `title` token. `title:"new merge request widget"` may return parsing error. `title: new merge request widget` should be used.
- You can have `labels` and `label` tokens at the same time. `labels: fronted discussion label: performance` is a valid query and all labels will be included in search. This example is equal with `labels: fronted discussion performance`. You can also have multiple `label` tokens. `label: frontend label: discussion label: performance` is valid and equal to `labels: fronted discussion performance`.

![_advanced-search.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_advanced-search.gif)


### Pipeline actions
One of the real power features of this extension is pipeline actions. This feature can be accessible from status bar by clicking the pipeline status text or command palette and allows you to,

- View latest pipeline on GitLab
- Create a new pipeline for your current branch
- Retry last pipeline
- Cancel last pipeline

![_pipeline_actions.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_pipeline_actions.gif)


### Status bar
If your current project is a GitLab project, extension will do the following things:

- Fetch pipeline of last commit and show it on the status bar. Clicking this item will open pipeline actions menu.
- Show open MR for current branch and show it on the status bar. Clicking this item will open MR on GitLab.
- Fetch closing issue of that MR and show it on the status bar. Clicking this item will open Issue on GitLab.

![_status_bar.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_status-bar.gif)


### Create snippet
You can create snippet from selection or entire file. You can also select visibility level of your snippet.

![_create-snippet.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_create-snippet.gif)


### Compare with master
You can see changes in your branch by comparing with `master` and see them on GitLab.

![_compare-with-master.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_compare-with-master.gif)

> Soon extension will support comparing with other branches.


### Open active file
This command allows you to see active file on GitLab. Extension sends active line number and selected text block to GitLab UI so you can see them highlighted.

![_open_active_file.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_open_active_file.gif)


### Validate GitLab CI Configuration
Using this command, you can quickly validate GitLab CI configuration.

![_validate-ci-config.gif](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/_validate-ci-config.gif)


-----


## Configuration options

**`gitlab.instanceUrl` (required: false, default: "https://gitlab.com")**

If you are using GitLab on a custom domain, you should add this to your user settings file. Example: `"gitlab.instanceUrl": "https://my-gitlab-domain.com"`

> You can open User Settings file by pressing `Cmd+,` on Mac OS or following `Code > Preferences > User Settings`. You can simply add extension configuration values to you User Settings file. This won't break or change anything on your VSCode.


## What's next?
- Open last commit on GitLab.
- MR actions picker which will allow you to
  - Go to specific MR tab, Discussions, Commits, Pipelines, Changes.
  - Assign MR to user.
  - View last commit.
- **[moonshot]** GitLab Dashboard tab where you can see your issues, MRs, Todos all in one place in VSCode.
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
