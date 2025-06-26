# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
