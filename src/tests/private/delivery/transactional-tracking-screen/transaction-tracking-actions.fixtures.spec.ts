import {
  TransactionTrackingActionCarrierTrackingWebview,
  TransactionTrackingActionDeeplink,
  TransactionTrackingActionUserAction,
  TransactionTrackingActionDialog,
} from '@api/core/model/delivery/transaction/tracking';

export const MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION: TransactionTrackingActionUserAction = {
  isUserAction: true,
  name: 'PACKAGE_ARRIVED',
  transactionId: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
  success: {
    isDismiss: true,
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS: TransactionTrackingActionUserAction = {
  isUserAction: true,
  name: 'PACKAGE_ARRIVED',
  transactionId: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
  success: {
    isDismiss: true,
  },
  analytics: {
    requestId: '123',
    source: 'Blabla',
    userId: '456',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DIALOG: TransactionTrackingActionDialog = {
  isDialog: true,
  description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
  negative: {
    title: 'Cancelar',
  },
  positive: {
    action: MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
    title: 'Confirmar',
  },
  title: '¿Confirmas que ya has recibido el producto?',
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS: TransactionTrackingActionDialog = {
  isDialog: true,
  description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
  negative: {
    title: 'Cancelar',
  },
  positive: {
    action: MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
    title: 'Confirmar',
  },
  title: '¿Confirmas que ya has recibido el producto?',
  analytics: {
    requestId: '123',
    source: 'Blabla',
    userId: '456',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS_2: TransactionTrackingActionDialog = {
  ...MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS,
  positive: {
    action: {
      ...MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
      analytics: {
        requestId: '32323232',
        source: '55555',
        userId: '767777',
      },
    },
    title: 'Confirmar',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW: TransactionTrackingActionCarrierTrackingWebview = {
  isCarrierTrackingWebview: true,
  linkUrl: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P',
  title: 'Sigue tu envío',
};

export const MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW_WITH_ANALYTICS: TransactionTrackingActionCarrierTrackingWebview = {
  isCarrierTrackingWebview: true,
  linkUrl: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P',
  title: 'Sigue tu envío',
  analytics: {
    requestId: '123',
    source: 'Blabla',
    userId: '456',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK: TransactionTrackingActionDeeplink = {
  isDeeplink: true,
  linkUrl: 'wallapop://i/190584802',
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK_WITH_ANALYTICS: TransactionTrackingActionDeeplink = {
  isDeeplink: true,
  linkUrl: 'wallapop://i/190584802',
  analytics: {
    requestId: '123',
    source: 'Blabla',
    userId: '456',
  },
};
