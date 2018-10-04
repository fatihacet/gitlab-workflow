# Contributing to GitLab Workflow

Thank you for your interest in contributing to GitLab Workflow! This guide details how to contribute
to this extension in a way that is easy for everyone. These are mostly guidelines, not rules.
Use your best judgment, and feel free to propose changes to this document in a merge request.

#### Table of Contents

*  [Code of Conduct](#code-of-conduct)
*  [Getting Started](#getting-started)
    *  [Reporting Issues](#reporting-issues)
    *  [Proposing Features](#proposing-features)
    *  [Configuring Development Environment](#configuring-development-environment)
    *  [Code Contribution For Beginners](#code-contribution-for-beginners)
    *  [Opening Merge Requests](#opening-merge-requests)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior by
[opening an issue](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/new) within project
and adding a label `Code of Conduct`.

## Getting Started

### Reporting Issues

This section guides you through submitting an issue/bug for GitLab Workflow.

Before creating issues, please check [list of existing issues](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues)
to see if issue you want to open is already known or not.

If you are facing issues around configuring Token from your GitLab.com account, see
list of **already addressed** [Token related issues](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues?scope=all&utf8=%E2%9C%93&state=closed&label_name[]=token-issue).
As chances are that problem you're facing already has a solution.

If issue is not found, you can [report your issue](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/new) along
with detailed description that includes;

*  Version of VS Code, GitLab Workflow and Operating System used.
*  Expected behaviour and actual behaviour.
*  Steps to reproduce the issue.

### Proposing Features

GitLab Workflow is currently maintained by handful of developers at GitLab in their free time, so not
all features proposed are promised to be developed. Please refer to "[What's next?](https://gitlab.com/fatihacet/gitlab-vscode-extension#whats-next)"
section of project README to know what we have in the project roadmap. Having said that, we welcome new and interesting
ideas that you might have for this extension, so feel free to propose those by opening an issue within
project with detailed description that includes;

*  How this feature is useful
*  Possible approach to implement it (we're open to your ideas)
*  Label `feature-proposal` added to the issue

### Configuring Development Environment

Developing and/or debugging GitLab Workflow works similar to any other VS Code extension. Here's how you can configure
development environment to work on the extension.

#### Step - 1 : Installation Prerequisites

We're assuming that you already have [Visual Studio Code](https://code.visualstudio.com/) installed along
with [GitLab Workflow](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow) installed
and configured, if not, do that first! If already done, proceed ahead.

*  [Git](https://git-scm.com/)
*  [NodeJS](https://nodejs.org/en/) (LTS or Current, any of it works)
*  [Yarn](https://yarnpkg.com/en/)

#### Step - 2 : Fork and Clone

*  Use your GitLab account to [fork](https://gitlab.com/fatihacet/gitlab-vscode-extension/forks/new) this project
    *  Don't know how forking works? Refer to [this guide](https://docs.gitlab.com/ee/gitlab-basics/fork-project.html#doc-nav).
    *  Don't have GitLab account? Create one! It is free and it is awesome!
*  Visit your forked project (usually URL is `https://gitlab.com/<your user name>/gitlab-vscode-extension`) and copy
   SSH or HTTPS URL to clone the project into your system.
    *  Don't know how to clone a project? Refer to [this guide](https://docs.gitlab.com/ee/gitlab-basics/command-line-commands.html#clone-your-project).

#### Step - 3 : Install dependencies

Once project is cloned, open terminal within the project folder and run following;

```bash
yarn install
```

This command will install all necessary dependencies to run and debug extension in developer mode.

#### Step - 4 : Running the extension

Open VS Code and then open GitLab Workflow project and then you can follow [Running and debugging your extension](https://code.visualstudio.com/docs/extensions/developing-extensions#_running-and-debugging-your-extension)
section from VS Code documentation.

### Code Contribution For Beginners

For newcomers to the project, you can take a look at issues labelled as `Contributions Welcome`
as available [here](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues?label_name%5B%5D=Contributions+Welcome).

### Opening Merge Requests

Steps to opening a merge request to contribute code to GitLab Workflow is similar to any other open source project.
You develop in a separate branch of your own fork and the merge request should have a related issue open in the project.
Any Merge Request you wish to open in order to contribute to GitLab Workflow, be sure you have followed through the steps from [Configuring Development Environment](#configuring-development-environment).
