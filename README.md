# Webapp
The private web app for Wallapop once you do login in the public one.

## Table of Contents
- [Installation](#installation)
- [Scripts](#scripts)
- [Commentaries](#commentaries)
- [Documentation](#documentation)

## Installation
To do a clean installation after downloading the repo, follow this steps:

1. Install [nvm](https://github.com/creationix/nvm), a node version manager.
2. Install the node version specified in `.nvmrc` with `nvm install x`. E.g.: `nvm install 8.9.4`.
3. Install [yarn](https://yarnpkg.com/lang/en/).
4. Execute `nvm use` to use the version of the `.nvmrc`.
5. Execute `yarn install` to download all dependencies.
6. Execute `./prepare_repo.sh` in a terminal.

## Scripts
### Local development server
In order to instantiate a local sever, run one of the following commands:

- Run `yarn start` for a standard dev server.  **(recommended)**
- Run `yarn serve` for a complete dev server build. (using AOT, i18n with Spanish translations, etc, but much slower)

Now you can navigate to `http://localhost:4200/login`.You should see the app running. If you change any of the source files, the app will automatically build again and reload the page.

### Tests
Run one of the following commands to test the app:
- Run `ng test` to execute the unit tests and watch for changes in Chrome and HeadlessChrome. **(recommended)**
- Run `yarn test` to execute the unit test once in HeadlessChrome.

For more information about the unit test syntaxis, you can check out [Jasmine](https://jasmine.github.io/tutorials/your_first_suite).

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

## Commentaries
### Login
You should be able to log in using one of the users described in this [Google Drive file](https://docs.google.com/spreadsheets/d/1lvo1gaid_Xb1Dw3_eTgBuWZWNmRLAUlIgaAy9KQza0E/edit?ts=5d00b86c#gid=1338714848).

### Environments
You have the environment variables on `src/environments/environment.ts`, you can change them locally to suit your needs.
Beware that some request are done to the wallapopBackend API and other are done to the public web API, so you may need to run locally also the web project.

### Cookies
If you are encountering problems switching branches or dockers, it is recommended that you clean first your cookies

### When opening a PR
- Make sure your branch name has a JIRA associated ticket. E.g.: `feature/PQP-XYZ`
- Make sure your commits have the JIRA associated ticket. E.g.: `[PQP-XYZ]: Commit message`
- Make sure you don't commit any unnecessary changes in `src/environments/environment.ts` file.
- Make sure you follow the template given in the `PULL_REQUEST_TEMPLATE.md` file. (automatically filled)
- Make sure the unit tests don't have one of the following Jasmine syntaxes: `fdescribe`, `fit`, `xdescribe`, `xit`.

## Documentation

Chat sequence diagrams: https://confluence.wallapop.com/display/ROV/Chat+sequence+diagrams
