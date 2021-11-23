export const UNAVAILABLE_DEEPLINKS_PREFIX: string[] = [
  'wallapop://selfservice/dispute/create/select-issue?t=',
  'wallapop://delivery/checkout?i=',
  'wallapop://selfservice/dispute?t=',
  'wallapop://delivery/transaction/experience-rating?transaction_id=',
];

// OpenDisputeDeeplink -> "wallapop://selfservice/dispute/create/select-issue?t=$transactionId"
// CheckoutDeeplink -> "wallapop://delivery/checkout?i=$itemHash"
// BuyerManageDisputeDeeplink -> "wallapop://selfservice/dispute?t=$transactionId&d=$disputeId&b=true"
// SellerManageDisputeDeeplink -> "wallapop://selfservice/dispute?t=$transactionId&d=$disputeId&b=false"
// TransactionExperienceRatingDeeplink - > "wallapop://delivery/transaction/experience-rating?transaction_id=${transactionId.asString()}"
