import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  name: 'prod',
  baseUrl: 'https://api.wallapop.com/',
  xmppDomain: 'wallapop.com',
  wsUrl: 'wss://mongooseimprotool-prod.wallapop.com:443/ws-xmpp',
  siteUrl: 'https://es.wallapop.com/',
  appboy: '47b54d36-7a86-4c05-9bfc-2d7b8aadd1ce',
  clickStreamURL: 'https://collector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_live_jXjzhS3WcTU1jg0QKkkUF8Dv00Ar0ATFyN',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.wallapop.com/metrics/chat',
  didomiKey: 'ffa4bae4-25a5-42df-a1a2-74f3dfa3cd35',
  threatMetrixOrgId: '6ldgf22r',
  threatMetrixProfilingDomain: 'h-wallapop.online-metrix.net'
};
