# Webapp

The private web app for Wallapop once you do login in the public one.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [How to deploy](#how-to-deploy)
- [Commentaries](#commentaries)
- [Documentation](#documentation)
- [Storybook](#storybook)
- [Prettier](#prettier)

## Installation

To do a clean installation after downloading the repo, follow this steps:

1. Install [nvm](https://github.com/creationix/nvm), a node version manager.
2. Install the node version specified in `.nvmrc` with `nvm install x`. E.g.: `nvm install 8.9.4`.
3. Install [yarn](https://yarnpkg.com/lang/en/).
4. Execute `nvm use` to use the version of the `.nvmrc`.
5. Execute `yarn install` to download all dependencies.

You must install and enable [ESLint](https://eslint.org/) in your preferred IDE before continuing:

- In case you are using **VS Code**, install and enable the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
- In case you are using **WebStorm**, follow [this](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_eslint_activate) guide to activate ESLint.

After installation, reload your IDE. You should be able to see the errors and warnings directly in your IDE.

## Scripts

### Local development server

In order to instantiate a local sever, run one of the following commands:

- Run `yarn start` to use default build configuration and point to beta.
- Run `yarn start XXX --options` where `XXX` is a dock number or beta and `--options` are a set of optional [serve options](https://angular.io/cli/serve). Examples:
  - `yarn start beta --hmr` will start webapp pointing to beta using [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) **(recommended)**
  - `yarn start 123 --port=4242 -c=es` to point to docker 123, running webapp at port 4242 and using Spanish translations
- Run `yarn start-beta` to use beta environment file with beta build configuration.

Now you can navigate to `http://localhost:4200/login`.You should see the app running. If you change any of the source files, the app will automatically build again and reload the page.

### Tests

Run one of the following commands to test the app:

- Run `yarn test` to execute the unit tests in watch mode. **(recommended)**
- Run `yarn test-once` to execute them only once.
- Run `yarn test-coverage` to first run the tests and if everything is ok, it will open an HTML with the coverage report.

We are using [Jest](https://jestjs.io/) as our tests runner and we use [Jasmine](https://jasmine.github.io/tutorials/your_first_suite) for syntaxis.

### Code scaffolding

To generate a new component, you can run the following command:

```
ng generate component component-name
```

You can also use it to generate directives, pipes, etc:

```
ng generate directive|pipe|service|class|module
```

### Build

You can run any of the following commands to build the project for each environment:
The build artifacts will be stored in the `dist/` directory.

```
yarn builddev
yarn builddocker
yarn builddocker-en
yarn buildbeta
yarn buildbeta-en
yarn buildprod
yarn buildprod-en
```

### Githooks

We are using a tool called [husky](https://typicode.github.io/husky/#/) to sync our defined scripts with native githooks that are defined at `scripts/githooks`.

By default, husky is sync (adds/removes/updates hooks) after every `postinstall` event when installing the package dependencies.

If you want to add a new hook, you should follow this steps:

1. Create a file in the `scripts/githooks` folder. The name should be an actual githook event to ease reading. Example: `scripts/githooks/pre-push`.
2. Attach the hook with husky using the following command:

```
npx husky add pre-push "scripts/githooks/pre-push"
```

3. A new file will be created: `.husky/pre-push`. You'll need to version this (husky v5 works this way).

## How to deploy:

Currently, this project uses gitflow. To start and finish a release one has to use the ReleaseBot

### Start release

```
release_begin repo=webapp version_update=minor
```

### End release

```
release_end repo=webapp
```

### Image Tagging

|               Branch Name                |                    Tag                     |
| :--------------------------------------: | :----------------------------------------: |
|                  master                  |                   stable                   |
|                 release                  |                  release                   |
|                  hotfix                  |                  release                   |
|                 develop                  |                   latest                   |
| any other branch (eg: feature/FRON-1234) | name of the branch (eg: feature-FRON-1234) |

## Commentaries

### Login

You should be able to log in using one of the users described in this [Google Drive file](https://docs.google.com/spreadsheets/d/1lvo1gaid_Xb1Dw3_eTgBuWZWNmRLAUlIgaAy9KQza0E/edit?ts=5d00b86c#gid=1338714848).

### Environments

You have the environment variables on `src/environments/environment.ts`, you can change them locally to suit your needs.
Beware that some request are done to the wallapopBackend API and other are done to the public web API, so you may need to run locally also the web project.

### Cookies

If you are encountering problems switching branches or dockers, it is recommended that you clean first your cookies

### Generate interfaces for tracking events (mParticle)

The analytics team provide us with a series of JSON's files with which we must validate each tracking event that is implemented (check this [repo](https://github.com/Wallapop/mparticle_json_validation) for more info). The following procedure will generate TS interfaces from these JSON files:

- Run `yarn install` for downloading the latest version of the validation JSONs.
- Run `yarn mparticle` for generating TS interfaces from the JSON files. New interfaces will be placed in `core/analytics/events-interfaces` directory.
- Use the generated interfaces when sending tracking events.

### When opening a PR

- Make sure your branch name has a JIRA associated ticket. E.g.: `feature/PQP-XYZ`
- Make sure your commits have the JIRA associated ticket. E.g.: `[PQP-XYZ]: Commit message`
- Make sure you follow the template given in the `PULL_REQUEST_TEMPLATE.md` file. (automatically filled)
- Make sure the unit tests don't have one of the following Jasmine syntaxes: `fdescribe`, `fit`, `xdescribe`, `xit`.

### Generate new metadata for phone number library

If you wanna update the value of the libphonenumber-js metadata you should follow the next steps:

- Edit the `generate-metadata.sh` file and customize it. You can check the [documentation](https://gitlab.com/catamphetamine/libphonenumber-js#customizing-metadata)
- Run `yarn libphonenumber-metadata` for update our metadata file.

## Documentation

Chat sequence diagrams: https://confluence.wallapop.com/display/ROV/Chat+sequence+diagrams

## Storybook

We've started to use [Storybook](https://storybook.js.org/) to develop and document the common components.

Scripts available to run:

| Script      | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `storybook` | Generates a documentation json file and starts a server on port 6006 with the Storybook project |

## Prettier

To enable the "format on save" option, follow this steps:

### WebStorm

1. Follow the steps of the next link:
   [Documentation](https://prettier.io/docs/en/webstorm.html)

### Visual Studio Code:

1. Download `Prettier - Code formatter` from VS code Extensions store.
2. `ctrl + shift + P` or `cmd + shift + P` → Preferences: Open settings (JSON).
3. Paste the following code:

```
{
 "editor.formatOnSave": true,
 "editor.defaultFormatter": "esbenp.prettier-vscode",
 "[javascript]": {
 "editor.defaultFormatter": "esbenp.prettier-vscode"
 }
}
```
