// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  profeatures: true,
  name: 'local',
  baseUrl: 'https://apigw.dock121.wallapop.com/',
  xmppDomain: 'dock121.wallapop.com',
  wsUrl: 'wss://dock121.wallapop.com:5282/ws-xmpp',
  siteUrl: 'https://es.dock121.wallapop.com/',
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Local',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents'
};
