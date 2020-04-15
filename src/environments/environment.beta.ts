import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  profeatures: true,
  name: 'beta',
  baseUrl: 'https://beta.wallapop.com/',
  xmppDomain: 'beta.wallapop.com',
  wsUrl: 'wss://mongooseimprotool-beta.wallapop.com:443/ws-xmpp',
  siteUrl: 'https://es.beta.wallapop.com/',
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Beta',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat'
};
