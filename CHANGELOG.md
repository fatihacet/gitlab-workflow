# CHANGELOG

## [0.3.3] - 2018-02-01
### Fixed
- Fixed slient failing of status bar items and hide them on error.


## [0.3.2] - 2018-01-31
### Fixed
- Fixed fetching remote url. Thanks to @kushalpandya.


## [0.3.1] - 2018-01-30
### Changed
- Clicking the pipeline status text on status bar now opens Pipeline action picker.


## [0.3.0] - 2018-01-30
### Added
- Pipeline actions picker
  - View latest pipeline on GitLab.com
  - Create a new pipeline for your current branch
  - Retry last pipeline
  - Cancel last pipeline


## [0.2.2] - 2018-01-29
### Added
- Added a new command to open current pipeline on GitLab.
- Added click handler to pipeline status text on status bar to open pipeline on GitLab.
- Added refresh interval for MR link on status bar.

### Fixed
- [#9](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/9) Branch names with slashes appear to break URL generation


## [0.2.1] - 2018-01-28
### Fixed
- Update pipeline status on status bar.


## [0.2.0] - 2018-01-27
### Added
- Added a new service layer to opearate git commands.
- Added a new service layer to talk with GitLab API.
- Added new methods to get info from Git and GitLab.
- Added Personal Access Token flow providing menu options to save and delete GitLab PAT.
- Implemented MR link on status bar and add click handler to open MR on GitLab.
- Implemented pipeline status on status bar.
- Implemented open active file on GitLab including active line number and selection.
- Implemented open current MR on GitLab.
- Implemented open GitLab to create new merge request.
- Implemented open GitLab to create new issue.

### Changed
- Deprecated `gitlab.userId`.
- Show assigned Issues and MRs now work project specific.

### Fixed
- [#7](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/7) Remove hardcoded origin in fetchGitRemote method.
- [#3](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/3) Assigned MR and issues openers should be project specific
- [#1](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/1) Local branch name and tracking remote branch name may not be the same
- [#8](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/8) API URL is hardcoded
- [#4](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/4) Remove pipes `|` from git commands
- [#5](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/5) Pipeline info won't be visible in status bar if there is no MR
- [#2](https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/4) Remove own MR requirement to find branch MR


## [0.1.1] - 2018-01-25
### Added
- Implemented show issues assinged to me.
- Implemented show merge requests assinged to me.
