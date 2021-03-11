export const RICH_AUDIENCE_URL = 'https://cdn3.richaudience.com/ab083674fb8200b877a6983126e4477d/wallapop/pb_wrapper/v1/lib_1.6.js';

export const CRITEO_URL = 'https://static.criteo.net/js/ld/publishertag.js';

export const GOOGLE_AD_SENSE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export const AMAZON_PUBLISHER_SERVICE_URL = './assets/js/amazon-publisher-service-wrapper.js';

export const ADS_SOURCES: string[] = [RICH_AUDIENCE_URL, CRITEO_URL, GOOGLE_AD_SENSE_URL, AMAZON_PUBLISHER_SERVICE_URL];

export const GOOGLE_ADS_SENSE_SHOPPING = 'https://www.google.com/adsense/search/ads.js';
export const GOOGLE_ADS_SENSE_SHOPPING_SCRIPT = `
(function(g,o){g[o]=g[o]||function(){(g[o]['q']=g[o]['q']||[]).push(
  arguments)},g[o]['t']=1*new Date})(window,'_googCsa');
`;
