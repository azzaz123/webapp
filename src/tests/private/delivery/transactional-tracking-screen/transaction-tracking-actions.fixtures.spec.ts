import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';

export const MOCK_TRANSACTION_TRACKING_ACTION_DIALOG: TransactionTrackingActionDetail = {
  isCarrierTrackingWebview: false,
  isDeeplink: false,
  isDialog: true,
  isDismiss: false,
  isReload: false,
  isUserAction: false,
  payload: {
    description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
    negative: {
      title: 'Cancelar',
    },
    positive: {
      action: {
        isCarrierTrackingWebview: false,
        isDeeplink: false,
        isDialog: false,
        isDismiss: false,
        isReload: false,
        isUserAction: true,
        payload: {
          name: 'PACKAGE_ARRIVED',
          parameters: {
            transactionId: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
          },
        },
      },
      title: 'Confirmar',
    },
    title: '¿Confirmas que ya has recibido el producto?',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW: TransactionTrackingActionDetail = {
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
};

export const MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK: TransactionTrackingActionDetail = {
  isCarrierTrackingWebview: false,
  isDeeplink: true,
  isDialog: false,
  isDismiss: false,
  isReload: false,
  isUserAction: false,
  payload: {
    linkUrl: 'wallapop://i/190584802',
  },
};

export const MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION = {
  isCarrierTrackingWebview: false,
  isDeeplink: false,
  isDialog: false,
  isDismiss: false,
  isReload: false,
  isUserAction: true,
  payload: {
    name: 'PACKAGE_ARRIVED',
    parameters: {
      transactionId: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
    },
  },
};
