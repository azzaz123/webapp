export interface TransactionTrackingAnalytics {
  buyer: TransactionTrackingAnalyticsUserProperties;
  seller: TransactionTrackingAnalyticsUserProperties;
}

export interface TransactionTrackingAnalyticsUserProperties {
  country: string;
}
