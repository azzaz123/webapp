export enum TRANSACTION_DELIVERY_STATUS {
  PENDING_DELIVERY_TO_CARRIER,
  DELIVERED_TO_CARRIER,
  IN_TRANSIT,
  DELIVERED,
  LOST,
  RETURNED,
  NONE,
  PENDING_REGISTRATION,
  AVAILABLE_FOR_THE_RECIPIENT,
  FAILED,
  ATTEMPT_PICKUP_FAILED,
  ATTEMPT_DELIVERY_FAILED,
  ON_HOLD_AT_CARRIER,
  ON_HOLD_INSTRUCTIONS_RECEIVED,
}