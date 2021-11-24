import { TransactionDetail } from '@private/features/delivery/pages/transaction-tracking-screen/interfaces/transaction-detail.interface';

export const MOCK_TRANSACTION_DETAIL_DEEPLINK: TransactionDetail = {
  description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
  iconClassName: 'rounded',
  iconSrc: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  showCaret: true,
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
};

export const MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION: TransactionDetail = {
  description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
  iconClassName: null,
  iconSrc: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
  showCaret: false,
  action: null,
};

export const MOCK_TRANSACTION_DETAIL_CARRIER_TRACKING_WEBVIEW: TransactionDetail = {
  description: 'Código de envío<br><strong>PK55Z20727923640108018P</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  iconSrc: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
  iconClassName: null,
  showCaret: false,
  action: {
    isCarrierTrackingWebview: true,
    isDeeplink: false,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      banner: { title: 'Código de envío', trackingCode: 'PK55Z20727923640108018P' },
      linkUrl: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P',
      title: 'Sigue tu envío',
    },
  },
};

const MOCK_TRANSACTION_DETAIL_DEEPLINK2: TransactionDetail = {
  description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
  iconClassName: 'circle',
  iconSrc: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
  showCaret: true,
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
};

const MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION2: TransactionDetail = {
  description: '<span style="color: #AFB6B6">Dirección de envío:</span><br>1234 No FLoor<br>08018 Barcelona',
  iconClassName: null,
  iconSrc:
    'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png',
  showCaret: false,
  action: null,
};

const MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION3: TransactionDetail = {
  description: '<span style="color: #AFB6B6">Método de cobro:</span><br>Monedero',
  iconClassName: null,
  iconSrc:
    'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png',
  showCaret: false,
  action: null,
};

export const MOCK_TRANSACTION_DETAILS: TransactionDetail[] = [
  MOCK_TRANSACTION_DETAIL_DEEPLINK,
  MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION,
  MOCK_TRANSACTION_DETAIL_DEEPLINK2,
  MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION2,
  MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION3,
];
