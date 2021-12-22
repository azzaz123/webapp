import { Environment } from './environment.interface';
import { environment as environmentBeta } from './environment.beta';
import { dockNum } from './docknum';
import { APP_LOCALE } from '@configs/subdomains.config';

const environmentLocal: Environment = {
  production: false,
  name: 'local',
  appDomain: `.dock${dockNum}.devel.wallapop.com/`,
  protocol: 'https://',
  baseUrl: `https://apigw.dock${dockNum}.devel.wallapop.com/`,
  xmppDomain: `dock${dockNum}.devel.wallapop.com`,
  wsUrl: `wss://mongooseimprotool-dock${dockNum}.wallapop.com:5282/ws-xmpp`,
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: 'Local',
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat',
  didomiKey: '56d12b9e-69db-4641-a15a-9c19f73aed7d',
  threatMetrixOrgId: '6ldgf22r',
  threatMetrixProfilingDomain: 'clear.wallapop.com',
};

export const environment = dockNum === 'beta' ? environmentBeta : environmentLocal;

export const isSWEnabled = false;
