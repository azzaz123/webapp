import {
  TransactionTrackingDetails,
  TransactionTrackingDetailsItem,
  TransactionTrackingDetailsUser,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';

const MOCK_TRANSACTION_TRACKING_DETAILS_ITEM: TransactionTrackingDetailsItem = {
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
    style: { className: 'rounded' },
  },
  price: { amount: { integer: 5, decimals: 90, total: 5.9 }, currency: { code: 'EUR', symbol: '€' } },
  title: 'crayones',
};
const MOCK_TRANSACTION_TRACKING_DETAILS_USER: TransactionTrackingDetailsUser = {
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?size=medium',
    style: { className: 'circle' },
  },
};

export const MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://i/190584802',
    },
  },
  description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
    style: {
      className: 'rounded',
    },
  },
  showCaret: true,
};
const MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_2: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://p/76921033',
    },
  },
  description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?size=medium',
    style: {
      className: 'circle',
    },
  },
  showCaret: true,
};

const MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_1: TransactionTrackingStatusInfo = {
  action: null,
  description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png?size=medium',
    style: {
      className: null,
    },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_2: TransactionTrackingStatusInfo = {
  action: null,
  description: '<span style="color: #AFB6B6">Dirección de envío:</span><br>1234 No FLoor<br>08018 Barcelona',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png?size=medium',
    style: {
      className: null,
    },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_3: TransactionTrackingStatusInfo = {
  action: null,
  description: '<span style="color: #AFB6B6">Método de cobro:</span><br>Monedero',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png?size=medium',
    style: {
      className: null,
    },
  },
  showCaret: false,
};

export const MOCK_TRANSACTION_TRACKING_DETAILS: TransactionTrackingDetails = {
  info: [
    MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1,
    MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_1,
    MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_2,
    MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_2,
    MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_3,
  ],
  item: MOCK_TRANSACTION_TRACKING_DETAILS_ITEM,
  title: 'Detalles del pedido',
  user: MOCK_TRANSACTION_TRACKING_DETAILS_USER,
};
