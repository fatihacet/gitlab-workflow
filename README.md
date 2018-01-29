# [GitLab VSCode Extension](https://gitlab.com/fatihacet/gitlab-vscode-extension)

This extension adds GitLab specific options to VSCode command pallette and status bar like showing pipeline status or opening active file on GitLab and much more.

### Features

- Shows pipeline status for current branch on VSCode status bar and click it to open pipeline on GitLab.
- Shows MR id of your current branch on VSCode status bar and click it to view on GitLab.
- View current file on GitLab, including active line number and range selection.
- View MR of current branch on GitLab.
- View issues assigned to you on GitLab.
- View MRs assigned to you on GitLab.
- View current pipeline on GitLab.
- View current project on GitLab.
- Open new issue page for your current project.
- Open new MR page for your current project.
- Ability to add and remove your GitLab Personal Access Token.

**Curious to know what's next?** [See here](#whats-next)


### Setup

To use this extension, you need to create a GitLab Personal Access Token and give it to the extension.

##### Step 1: Create your Personal Access Token
- Go to "Settings" page on GitLab.com or your self hosted GitLab instance.
- On the left navigation menu, click "Access Tokens".
- On "Add a personal access token" form
  - Give a name to your token.
  - Select and expiry date.
  - Select "api" and "read_user" permissions.
  - Hit "Create personal access token" button.
- Copy the token. _Remember you won't be able to see value of this token ever again for security reasons._

##### Step 2: Add token to GitLab Workflow Extension
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for "GitLab: Set GitLab Personal Access Token" and hit Enter.
- Extension will ask your PAT. Paste your PAT and hit Enter. _It won't be visible and accessible to others._

That's it. 🏁

You can start using this extension right away. If your project has a pipeline for last commit and a MR from your current branch, you should see them on VSCode status bar. 🎉


### Usage
- Open up Command Palette by pressing `Cmd+Shift+P`.
- Search for GitLab

![https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png](https://gitlab.com/fatihacet/gitlab-vscode-extension/raw/master/src/assets/gitlab-vscode.png)


### Configuration options

##### `gitlab.instanceUrl` (required: false, default: 'https://gitlab.com')
If you are using GitLab on a custom domain, you should add this to your user settings file. Example: `"gitlab.instanceUrl": "https://my-gitlab-domain.com"`

> You can open User Settings file by pressing `Cmd+,` on Mac OS or following `Code > Preferences > User Settings`. You can simply add extension configuration values to you User Settings file. This won't break or change anything on your VSCode.


### What's next?
- Pipeline link to pipeline status bar item.
- View last pipeline on GitLab
- Pipeline actions menu to quickly retry or cancel a pipeline.
- Issue and MR search
- Detailed issue and MR search
  - `title:MR discussions refactor label:frontend label:discussions assignee:fatihacet`
- Compare your changes with master on GitLab


### Contribution
This extension is open source and [hosted on GitLab](https://gitlab.com/fatihacet/gitlab-vscode-extension). Contributions are more than welcome. Feel free to fork and add new features or submit bug reports.
