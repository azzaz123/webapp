import { HTTP_PROTOCOL } from 'configs/protocol.config';

export interface Environment {
  production: boolean;
  name: string;
  baseUrl: string;
  appDomain: string;
  protocol: HTTP_PROTOCOL;
  xmppDomain: string;
  wsUrl: string;
  siteUrl: string;
  appboy: string;
  cookieSuffix: string;
  clickStreamURL: string;
  stripeKey: string;
  mParticleKey: string;
  remoteConsoleUrl: string;
  didomiKey: string;
  threatMetrixOrgId: string;
  threatMetrixProfilingDomain: string;
}
