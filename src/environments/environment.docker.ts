import { APP_LOCALE } from '@configs/subdomains.config';
import { Environment } from './environment.interface';

export const getDockNum = (): string => {
  let result = 'XXX';

  const dockPrefix = 'dock';
  const dockPrefixPos = window.location.hostname.indexOf(dockPrefix);

  if (dockPrefixPos !== -1) {
    try {
      result = window.location.hostname.substring(dockPrefixPos + dockPrefix.length, dockPrefixPos + dockPrefix.length + 3);
    } catch {}
  }

  return `dock${result}`;
};

export const docknum = getDockNum();

export const environment: Environment = {
  production: false,
  name: 'docker',
  appDomain: `.${docknum}.devel.wallapop.com/`,
  protocol: 'https://',
  baseUrl: `https://apigw.${docknum}.devel.wallapop.com/`,
  xmppDomain: `mongooseimprotool-${docknum}.devel.wallapop.com`,
  wsUrl: `wss://mongooseimprotool-${docknum}.devel.wallapop.com:5282/ws-xmpp`,
  appboy: '516bd193-25b2-48b9-b79d-f8516f104d2f',
  cookieSuffix: `${docknum}`,
  clickStreamURL: 'https://precollector.wallapop.com/clickstream.json/sendEvents',
  stripeKey: 'pk_test_YMrctQusG3vLNQkCSRYKdqwF',
  mParticleKey: 'us1-04eb03d316b54f4f99265340abe886e6',
  remoteConsoleUrl: 'https://client-metrics.beta.wallapop.com/metrics/chat',
  didomiKey: '56d12b9e-69db-4641-a15a-9c19f73aed7d',
  threatMetrixOrgId: '6ldgf22r',
  threatMetrixProfilingDomain: 'clear.wallapop.com',
};

export const isSWEnabled = false;
