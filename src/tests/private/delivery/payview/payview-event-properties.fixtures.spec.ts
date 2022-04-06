import { ViewTransactionPayScreen } from '@core/analytics/resources/events-interfaces/view-transaction-pay-screen.interface';
import { SCREEN_IDS } from '@core/analytics/resources/analytics-screen-ids';
import { MOCK_PAYVIEW_ITEM } from './payview-item.fixtures.spec';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { ClickHelpTransactional } from '@core/analytics/resources/events-interfaces/click-help-transactional.interface';
import { ClickAddPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-add-promocode-transaction-pay.interface';
import { ClickApplyPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-apply-promocode-transaction-pay.interface';
import { PayTransaction } from '@core/analytics/resources/events-interfaces/pay-transaction.interface';
import { TransactionPaymentSuccess } from '@core/analytics/resources/events-interfaces/transaction-payment-success.interface';
import { MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { TransactionCheckoutError } from '@core/analytics/resources/events-interfaces/transaction-checkout-error.interface';
import { MOCK_UUID } from '@fixtures/core/uuid/uuid.fixtures.spec';

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD: ViewTransactionPayScreen = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
  feesPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.amount.total,
  sellerUserId: MOCK_PAYVIEW_ITEM.owner,
  preselectedPaymentMethod: 'bank card',
  useWallet: false,
  sellerCountry: 'ES',
};

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_PAYPAL: ViewTransactionPayScreen = {
  ...MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  preselectedPaymentMethod: 'paypal',
};

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET: ViewTransactionPayScreen = {
  ...MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  useWallet: true,
  preselectedPaymentMethod: 'wallet',
};

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_CREDIT_CARD: ViewTransactionPayScreen = {
  ...MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  useWallet: true,
  preselectedPaymentMethod: 'wallet, bank card',
};

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_WALLET_AND_PAYPAL: ViewTransactionPayScreen = {
  ...MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  useWallet: true,
  preselectedPaymentMethod: 'wallet, paypal',
};

export const MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITHOUT_PAYMENT_PREFERENCE: ViewTransactionPayScreen = {
  ...MOCK_VIEW_TRANSACTION_PAY_SCREEN_EVENT_PROPERTIES_WITH_CREDIT_CARD,
  useWallet: false,
  preselectedPaymentMethod: null,
};

export const MOCK_ADD_EDIT_CARD_EVENT_WITH_ADD_ACTION: ClickAddEditCard = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  addOrEdit: 'add',
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_ADD_EDIT_CARD_EVENT_WITH_EDIT_ACTION: ClickAddEditCard = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  addOrEdit: 'edit',
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT: ClickAddEditAddress = {
  screenId: SCREEN_IDS.Checkout,
  addOrEdit: 'edit',
  addressType: 'home',
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemId: MOCK_PAYVIEW_ITEM.id,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_HOME_AND_ADD_ACTION: ClickAddEditAddress = {
  screenId: SCREEN_IDS.Checkout,
  addOrEdit: 'add',
  addressType: 'home',
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemId: MOCK_PAYVIEW_ITEM.id,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_EDIT_ACTION: ClickAddEditAddress = {
  screenId: SCREEN_IDS.Checkout,
  addOrEdit: 'edit',
  addressType: 'office',
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemId: MOCK_PAYVIEW_ITEM.id,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_WITH_OFFICE_AND_ADD_ACTION: ClickAddEditAddress = {
  screenId: SCREEN_IDS.Checkout,
  addOrEdit: 'add',
  addressType: 'office',
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemId: MOCK_PAYVIEW_ITEM.id,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
};

export const MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES: ClickHelpTransactional = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
  sellerUserId: MOCK_PAYVIEW_ITEM.owner,
  helpName: 'Help Top Pay Screen',
};

export const MOCK_CLICK_ADD_PROMOCODE_TRANSACTION_PAY: ClickAddPromocodeTransactionPay = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
  sellerUserId: MOCK_PAYVIEW_ITEM.owner,
};

export const MOCK_CLICK_APPLY_PROMOCODE_TRANSACTION_PAY: ClickApplyPromocodeTransactionPay = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
  sellerUserId: MOCK_PAYVIEW_ITEM.owner,
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD: PayTransaction = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  categoryId: MOCK_PAYVIEW_ITEM.categoryId,
  itemPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.total,
  sellerUserId: MOCK_PAYVIEW_ITEM.owner,
  feesPrice: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.amount.total,
  isBumped: false,
  paymentMethod: 'bank card',
  deliveryMethod: 'buyer address',
  walletBalanceAmount: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.total,
  isPromoApplied: false,
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_PAYPAL: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  paymentMethod: 'paypal',
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_PAYPAL_AND_PROMOCODE: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  feesPrice: 2.5,
  itemPrice: 56.7,
  paymentMethod: 'paypal',
  isPromoApplied: true,
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_PAYPAL_AND_CARRIER_OFFICE: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  deliveryMethod: 'carrier office',
  paymentMethod: 'paypal',
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_WALLET: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  paymentMethod: 'wallet',
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_WALLET_AND_CREDIT_CARD: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  paymentMethod: 'wallet, bank card',
};

export const MOCK_PAY_TRANSACTION_EVENT_WITH_WALLET_AND_PAYPAL: PayTransaction = {
  ...MOCK_PAY_TRANSACTION_EVENT_WITH_CREDIT_CARD,
  paymentMethod: 'wallet, paypal',
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD: TransactionPaymentSuccess = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  requestId: MOCK_UUID,
  country: 'ES',
  language: 'ES',
  paymentMethod: 'bank card',
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_WALLET: TransactionPaymentSuccess = {
  ...MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
  paymentMethod: 'wallet',
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_PAYPAL: TransactionPaymentSuccess = {
  ...MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
  paymentMethod: 'paypal',
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_WALLET_AND_CREDIT_CARD: TransactionPaymentSuccess = {
  ...MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
  paymentMethod: 'wallet, bank card',
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_WALLET_AND_PAYPAL: TransactionPaymentSuccess = {
  ...MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD,
  paymentMethod: 'wallet, paypal',
};

export const MOCK_TRANSACTION_PAYMENT_ERROR_WITH_CANCEL_PAYMENT: TransactionCheckoutError = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  errorType: 'cancel payment',
  paymentMethod: 'bank card',
  walletBalanceAmount: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.total,
};
