// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  name: 'local',
  baseUrl: 'https://apigw.dockXXX.wallapop.com/',
  xmppDomain: 'dock115.wallapop.com',
  wsUrl: 'ws://dock115.wallapop.com:5282/ws-xmpp',
  siteUrl: 'http://es.dev.wallapop.com:8080/',
  bypass: 'p3-9p0dJk2cHp3-4RsW0',
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Local',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents'
};

