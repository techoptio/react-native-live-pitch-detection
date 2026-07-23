# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the root directory.
- An example app in the `example/` directory.

To get started with the project, make sure you have the correct version of [Node.js](https://nodejs.org/) installed. See the [`.nvmrc`](./.nvmrc) file for the version used in this project.

Run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development without manually migrating.

The [example app](/example/) demonstrates usage of the library. You need to run it to test any changes you make.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild, but native code changes will require a rebuild of the example app.

If you want to use Android Studio or Xcode to edit the native code, you can open the `example/android` or `example/ios` directories respectively in those editors. To edit the Objective-C or Swift files, open `example/ios/ReactNativeLivePitchDetectionExample.xcworkspace` in Xcode and find the source files at `Pods > Development Pods > @techoptio/react-native-live-pitch-detection`.

To edit the Java or Kotlin files, open `example/android` in Android studio and find the source files at `techoptio-react-native-live-pitch-detection` under `Android`.

You can use various commands from the root directory to work with the project.

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

To confirm that the app is running with the new architecture, you can check the Metro logs for a message like this:

```sh
Running "ReactNativeLivePitchDetectionExample" with {"fabric":true,"initialProps":{"concurrentRoot":true},"rootTag":1}
```

Note the `"fabric":true` and `"concurrentRoot":true` properties.

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typecheck
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module.
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing. C++ unit tests live under `shared/tests` and run with `yarn test:cpp`.

Pre-commit hooks run ESLint and TypeScript on staged files. Full Jest, C++, library, Android, and iOS checks run in [GitHub Actions](.github/workflows/ci.yml) on every pull request and push to `main`.

### Publishing to npm

Releases use [release-it](https://github.com/release-it/release-it) locally to bump the version, commit, tag (`vX.Y.Z`), and create a GitHub Release. Publishing to the npm registry happens in CI when that tag is pushed ([`.github/workflows/publish.yml`](.github/workflows/publish.yml)), using [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC)—no long-lived npm token in GitHub Secrets.

#### One-time setup (maintainers)

**On [npmjs.com](https://www.npmjs.com/package/@techoptio/react-native-live-pitch-detection):**

1. Sign in with an account that can publish `@techoptio/react-native-live-pitch-detection`.
2. Open the package → **Settings** → **Trusted Publisher**.
3. Add a GitHub Actions publisher:
   - Organization or user: `techoptio`
   - Repository: `react-native-live-pitch-detection`
   - Workflow filename: `publish.yml`
   - Environment: leave empty unless you also configure a matching GitHub Environment (e.g. `npm`)
   - Allowed actions: `npm publish`
4. Ensure account 2FA is enabled.

**On GitHub:**

1. Merge `publish.yml` to the default branch before the first OIDC publish (trusted publisher binds to that workflow name).
2. Confirm Actions are enabled and the workflow can use `id-token: write`.
3. Optional: create an Environment named `npm` with required reviewers / tag rules, and set the same environment name on the Trusted Publisher and on the publish job.
4. Protect `main` with required CI checks (lint, test, build-library, build-android, build-ios).
5. Do **not** add an `NPM_TOKEN` secret for this flow.

#### Cut a release

1. Ensure `main` is green (all CI jobs, including Android and iOS example builds).
2. On a clean checkout of `main`:

```sh
yarn release
```

3. Confirm the `vX.Y.Z` tag and GitHub Release were created.
4. Watch the **Publish** workflow on the tag; confirm the version on npm:

```sh
npm view @techoptio/react-native-live-pitch-detection version
```

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn`: setup project by installing dependencies.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn test:cpp`: run C++ unit tests with CMake/CTest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.
- `yarn release`: bump version, tag, and create a GitHub Release (npm publish runs in CI).

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
