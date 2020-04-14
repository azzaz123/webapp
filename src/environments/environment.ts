import { dockNum } from './docknum';

export interface ENVIRONMENT {
  production: boolean;
  profeatures: boolean;
  name: string;
  baseUrl: string;
  xmppDomain: string;
  wsUrl: string;
  siteUrl: string;
  appboy: string;
  cookieSuffix: string;
  clickStreamURL: string;
  stripeKey: string;
  mParticleKey: string;
  remoteConsoleUrl: string;
}

export const environment: ENVIRONMENT = {
  production: false,
  profeatures: true,
  name: 'local',
  baseUrl: `https://apigw.dock${dockNum}.wallapop.com/`,
  xmppDomain: `dock${dockNum}.wallapop.com`,
  wsUrl: `wss://dock${dockNum}.wallapop.com:5282/ws-xmpp`,
  siteUrl: `https://es.dock${dockNum}.wallapop.com/`,
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Local',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat'
};
