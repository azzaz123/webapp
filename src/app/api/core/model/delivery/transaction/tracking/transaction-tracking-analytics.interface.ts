export interface TransactionTrackingAnalytics {
  buyer: TransactionTrackingAnalyticsUserProperties;
  seller: TransactionTrackingAnalyticsUserProperties;
}

interface TransactionTrackingAnalyticsUserProperties {
  country: string;
}
