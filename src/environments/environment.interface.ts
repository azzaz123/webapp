export interface Environment {
  production: boolean;
  name: string;
  baseUrl: string;
  xmppDomain: string;
  wsUrl: string;
  siteUrl: string;
  appboy: string;
  cookieSuffix?: string;
  clickStreamURL: string;
  stripeKey: string;
  mParticleKey: string;
  remoteConsoleUrl: string;
  didomiKey: string;
  threatMetrixOrgId: string;
}
