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
declare let Criteo: import('./app/core/ads/interfaces/criteo.interface').CriteoLibrary;
declare let apstag: import('./app/core/ads/interfaces/amazon-publisher-service.interface').AmazonPublisherServiceLibrary;
declare let mParticle: any;
declare let Didomi: import('./app/core/didomi/didomi.interface').DidomiLibrary;
declare let wadgtlft: import('./app/core/trust-and-safety/threat-metrix.interface').ThreatMetrixLibrary;
