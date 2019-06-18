# Webapp

## Dependencies

You need to have installed the node version specified on `.nvmrc` and [yarn](https://yarnpkg.com/lang/en/).

To manage node versions, it is recommended to use a version manager like [nvm](https://github.com/creationix/nvm).

To install the project dependencies use `yarn install`.

## Prepare repo

Run ./prepare_repo.sh in terminal.

## Environments

You have the environment variables on `src/environments/environment.ts`, you can change them locally to suit your needs.

Beware that some request are done to the wallapopBackend API and other are done to the public web API, so you may need to run locally also the web project.

## Development server

Run `yarn start` for a dev server, or `yarn serve` for a dev server with a complete build (Using aot, i18n etc.). For faster build times in development, we encourage you to use `yarn start`.

If you want to run the site with Spanish translations, use `yarn serve`.

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

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

## Documentation

Chat sequence diagrams avaiable at: https://confluence.wallapop.com/display/ROV/Chat+sequence+diagrams
