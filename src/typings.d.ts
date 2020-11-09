/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare let System: any;
declare let XMPP: any;
declare let analytics: any;
declare let appboy: any;
declare let ga: Function;
declare let fbq: Function;
declare let pintrk: Function;
declare let googletag: any;
declare let Criteo: any;
declare let apstag: any;
declare let Adomik: any;
declare let stripe: any;
declare let elements: any;
declare let paymentIntent: any;
declare let Stripe: any;
declare let mParticle: any;
declare let Didomi: import('./app/core/didomi/didomi.interface').DidomiLibrary;
declare let wadgtlft: import('./app/core/trust-and-safety/threat-metrix.interface').ThreatMetrixLibrary;
