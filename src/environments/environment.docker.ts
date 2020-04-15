import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  profeatures: true,
  name: 'docker',
  baseUrl: 'https://apigw.dockXXX.wallapop.com/',
  xmppDomain: 'dockXXX.wallapop.com',
  wsUrl: 'wss://dockXXX.wallapop.com:5282/ws-xmpp',
  siteUrl: 'https://es.dockXXX.wallapop.com/',
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'dockXXX',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat'
};
