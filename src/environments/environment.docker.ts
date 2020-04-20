import { Environment } from './environment.interface';

export const tryGetDockNum = (): string => {
  let result = 'XXX';

  const dockPrefix = 'dock';
  const dockPrefixPos = window.location.hostname.indexOf(dockPrefix);

  if (dockPrefixPos !== -1) {
    try {
      result = window.location.hostname.substring(dockPrefixPos + dockPrefix.length, dockPrefixPos + dockPrefix.length + 3);
    } catch { }
  }

  return `dock${result}`;
};

export const docknum = tryGetDockNum();

export const environment: Environment = {
  production: false,
  profeatures: true,
  name: 'docker',
  baseUrl: `https://apigw.${docknum}.wallapop.com/`,
  xmppDomain: `${docknum}.wallapop.com`,
  wsUrl: `wss://${docknum}.wallapop.com:5282/ws-xmpp`,
  siteUrl: `https://es.${docknum}.wallapop.com/`,
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: `${docknum}`,
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat'
};
