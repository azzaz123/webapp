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
import { TransactionPaymentError } from '@core/analytics/resources/events-interfaces/transaction-payment-error.interface';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';

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
  isBumped: false,
  paymentMethod: 'bank card',
  walletBalanceAmount: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.total,
};

export const MOCK_TRANSACTION_PAYMENT_SUCCESS_WITH_CREDIT_CARD: TransactionPaymentSuccess = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  country: 'ES',
  language: 'ES',
  currency: 'EUR',
  paymentMethod: 'bank card',
};

export const MOCK_TRANSACTION_PAYMENT_ERROR_WITH_CANCEL_PAYMENT: TransactionPaymentError = {
  screenId: SCREEN_IDS.Checkout,
  itemId: MOCK_PAYVIEW_ITEM.id,
  errorType: 'cancel payment',
  paymentMethod: 'bank card',
  walletBalanceAmount: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY.amount.total,
};
