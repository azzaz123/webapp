// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  name: 'local',
  baseUrl: 'http://dock7.corp.wallapop.com:8080/',
  xmppDomain: 'dock7.wallapop.com',
  wsUrl: 'ws://dock7.corp.wallapop.com:5281/ws-xmpp',
  loginUrl: 'http://es.dev.wallapop.com:8080/login',
  bypass: 'p3-9p0dJk2cHp3-4RsW0'
};

