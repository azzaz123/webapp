// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  name: 'local',
  baseUrl: 'https://beta.wallapop.com/',
  xmppDomain: 'beta.wallapop.com',
  wsUrl: 'wss://mongooseimprotool-beta.wallapop.com:443/ws-xmpp',
  siteUrl: 'https://es.beta.wallapop.com/',
  bypass: 'p3-9p0dJk2cHp3-4RsW0',
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Local',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents'
};

