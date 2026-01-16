# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.1](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/compare/v1.1.0...v1.1.1) (2026-01-16)


### Fixed

* update API URL ([e5c1105](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/e5c1105ccd4fcba52ded1bb7fe80f1b09231dba9))


### Chores

* update cspell configuration with additional words and ignore CHANGELOG.md ([9b22549](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/9b22549a10f4dc96dccd50763c13118e4e1a212b))
* update devDependencies ([cdf1d5c](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/cdf1d5c455b0934c8dddf426e6d42b4a313c4f0f))

## [1.1.0](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/compare/v1.0.8...v1.1.0) (2026-01-13)


### Added

* add comprehensive error handling and loading states ([d57f525](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/d57f525cd797148831b49cdc916138e23dddd202))


### Fixed

* prevent memory leak by clearing old interval ([ce8f98c](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/ce8f98c6cf16e87c744d29bd0e8888968ed3d328))
* update API endpoint URL to fix JSON parsing error ([a0ff03e](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/a0ff03ec91cbb9b187d3c9fac04aa11a1abff839))


### Chores

* add demo  config and script ([f8e721b](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/f8e721bfca7113183b6515b866936df149a424ff))
* add release script and commit-and-tag-version ([5ebfd26](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/5ebfd268e933d8e2162373d69f4c9ad1e42755de))
* change runner from ubuntu-latest to ubuntu-slim for automated tests ([48024df](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/48024dffe1838c6e67f902c2d619829d91ab9308))
* replace husky with simple-git-hooks ([b69e098](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/b69e098fdd08d3154f961efd7d8fac2b1613d67d))
* update actions/checkout to v5 in automated tests workflow ([dbd8ed1](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/dbd8ed19439421e270476e3a0a67af344bdde70b))
* update devDependencies ([8945b9e](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/8945b9e00a8554cfac938ca4c884e1675f5272af))
* update GitHub Actions to use latest checkout and setup-node versions ([e2e5a1b](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/e2e5a1bcfec1ca3705a811b81ba901bd15c85717))


### Code Refactoring

* improve DOM manipulation efficiency ([f41f103](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/f41f10386c114660bd354f41e794d8a60c1012f4))
* move apiToken to defaults ([78362a8](https://github.com/KristjanESPERANTO/MMM-ApothekenNotdienst/commit/78362a8d68b82d68aa9a6e9888a2b07a0a5c6fb2))

## [1.0.8](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.7...v1.0.8) - 2025-06-26

### Changed

- chore: add missing type field in `package.json`
- chore: disable new linter rule `css/no-invalid-properties`
- chore: remove unused ESLint rules
- chore: update devDependencies
- refactor: simplify setInterval callback in `node_helper`

## [1.0.7](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.6...v1.0.7) - 2025-05-28

### Changed

- chore: update devDependencies

### Fixed

- fix: update token (we should implement a function to fetch the token automatically in the future)

## [1.0.6](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.5...v1.0.6) - 2025-05-25 - Maintenance release

### Changed

- chore: refactor linting setup
- chore: update devDependencies
- refactor: use CSS nesting

## [1.0.5](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.4...v1.0.5) - 2025-05-03 - Maintenance release

### Changed

- chore: refactor ESLint config to use `defineConfig` and add plugins for json, css and markdown
- chore: setup `husky` and `lint-staged`
- chore: update devDependencies
- chore: use `node --run` instead of `npm run` for CI and development command
- docs: add npm install command to developer commands section
- refactor: remove parameter reassignment

## [1.0.4](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.3...v1.0.4) - 2025-04-03 - Maintenance release

### Added

- chore: Add dependabot workflow

### Changed

- chore: Disable "no-duplicate-heading" rule in markdownlint
- chore: Update devDependencies
- refactor: update ESLint configuration to use new import plugin structure

## [1.0.3](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.2...v1.0.3) - 2025-03-20 - Maintenance release

### Changed

- Update devDependencies
- Simplify stylelint config

## [1.0.2](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.1...v1.0.2) - 2025-02-24 - Maintenance release

### Added

- Add cspell and handle spelling issues

### Changed

- Update devDependencies
- Replace `eslint-plugin-import` with `eslint-plugin-import-x`
- Replace deprecated "all-flat" by "all" stylistic config
- Sort `package.json` keys

## [1.0.1](https://github.com/KristjanESPERANTO/MMM-Forum/compare/v1.0.0...v1.0.1) - 2025-02-02 - Maintenance release

- Add `header` to config example in README
- Add `repository` to `package.json`
- Add GitHub workflow for automated testing
- Update devDependencies
- Fix instructions and update description in README

## [1.0.0](https://github.com/KristjanESPERANTO/MMM-Forum/releases/tag/v1.0.0) - 2025-01-29

Initial release.
