/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare let System: any;
declare let analytics: any;
declare let appboy: import('./app/core/communication/vendors/appboy.interface').Appboy;
declare let fetchHeaderBids: Function;
declare let Optimize: import('./app/core/experimentation/vendors/optimize/optimize.interface').GoogleOptimize;
declare let Criteo: import('./app/core/ads/vendors/criteo/criteo.interface').CriteoLibrary;
declare let apstag: import('./app/core/ads/vendors/amazon/amazon-publisher-service.model').AmazonPublisherServiceLibrary;
declare let Didomi: import('./app/core/ads/vendors/didomi/didomi.interface').DidomiLibrary;
declare let wadgtlft: import('./app/core/trust-and-safety/threat-metrix.interface').ThreatMetrixLibrary;
declare let _googCsa: import('./app/core/ads/vendors/google/google-ads-sense-shopping').GoogCsa;
