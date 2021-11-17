import {
  TransactionTracking,
  TransactionTrackingAction,
  TransactionTrackingAnalytics,
  TransactionTrackingHeader,
  TransactionTrackingShippingStatus,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';

const MOCK_TRANSACTION_TRACKING_ANALYTICS_2: TransactionTrackingAnalytics = {
  buyer: { country: 'IT' },
  seller: { country: 'ES' },
};
const MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_1: TransactionTrackingAction = {
  action: {
    analytics: {
      requestId: 'b7d11763-1c05-4cd8-9733-c3449807f644',
      source: 'Help General Doubts',
      userId: '77605037',
    },
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360013447218',
    },
  },
  state: {
    isDisabled: false,
  },
  style: {
    className: 'btn btn-link',
  },
  title: '¿Dudas?',
};
const MOCK_TRANSACTION_TRACKING_HEADER_1: TransactionTrackingHeader = {
  detail: MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_1,
  title: 'Estado de tu compra',
};
const MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1: TransactionTrackingShippingStatus = {
  actions: [
    {
      action: {
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
      },
      state: { isDisabled: false },
      style: { className: 'btn btn-primary' },
      title: 'Ya lo he recibido',
    },
  ],
  animation: {
    isLoop: true,
    isLoopReverse: false,
    isNormal: false,
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_in_transit_animation.json',
  },
  description: 'Llegará en un plazo estimado de <strong>3 días hábiles.</strong> ¡Que pasen rápido! ',
  title: 'Paquete en reparto',
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_1: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
    },
  },
  description:
    '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    style: {
      className: null,
    },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1: TransactionTrackingStatusInfo = {
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
  description: 'Código de envío<br><strong>PK55Z20727923640108018P</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    style: { className: null },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_2: TransactionTrackingAction = {
  action: {
    analytics: {
      requestId: '3d5d9154-1e52-4a99-87ee-bdedd7b1eb70',
      source: 'Help General Doubts',
      userId: '81497033',
    },
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360013447218',
    },
  },
  state: { isDisabled: false },
  style: { className: 'btn btn-link' },
  title: '¿Dudas?',
};
const MOCK_TRANSACTION_TRACKING_HEADER_2: TransactionTrackingHeader = {
  detail: MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_2,
  title: 'Estado de tu compra',
};
const MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_2: TransactionTrackingShippingStatus = {
  actions: [
    {
      action: {
        isCarrierTrackingWebview: false,
        isDeeplink: false,
        isDialog: true,
        isDismiss: false,
        isReload: false,
        isUserAction: false,
        payload: {
          description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
          negative: { title: 'Cancelar' },
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
                  transactionId: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
                },
              },
            },
            title: 'Confirmar',
          },
          title: '¿Confirmas que ya has recogido el producto?',
        },
      },
      state: { isDisabled: false },
      style: { className: 'btn btn-primary' },
      title: 'Ya lo he recogido',
    },
  ],
  animation: {
    isLoop: true,
    isLoopReverse: false,
    isNormal: false,
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_available_for_the_recipient_carrier_office_delivery_buyer_animation.json',
  },
  description:
    'Tu compra te espera en el punto de recogida situado en <strong>Via XXIV Maggio 76, 03037, Pontecorvo</strong>.<br><br>La fecha límite de recogida es el <strong>04/09/2021</strong>. Superado el plazo, será devuelto al vendedor y la transacción se cancelará.',
  title: '¡Paquete listo para recoger!',
};
const MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_3: TransactionTrackingShippingStatus = {
  actions: [
    {
      action: {
        isCarrierTrackingWebview: false,
        isDeeplink: false,
        isDialog: true,
        isDismiss: false,
        isReload: false,
        isUserAction: false,
        payload: {
          description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
          negative: { title: 'Cancelar' },
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
                  transactionId: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
                },
                success: {
                  isCarrierTrackingWebview: false,
                  isDeeplink: false,
                  isDialog: false,
                  isDismiss: true,
                  isReload: false,
                  isUserAction: false,
                  payload: {},
                },
              },
            },
            title: 'Confirmar',
          },
          title: '¿Confirmas que ya has recogido el producto?',
        },
      },
      state: { isDisabled: false },
      style: { className: 'btn btn-primary' },
      title: 'Ya lo he recogido',
    },
  ],
  animation: {
    isLoop: true,
    isLoopReverse: false,
    isNormal: false,
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_available_for_the_recipient_carrier_office_delivery_buyer_animation.json',
  },
  description:
    'Tu compra te espera en el punto de recogida situado en <strong>Via XXIV Maggio 76, 03037, Pontecorvo</strong>.<br><br>La fecha límite de recogida es el <strong>04/09/2021</strong>. Superado el plazo, será devuelto al vendedor y la transacción se cancelará.',
  title: '¡Paquete listo para recoger!',
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_2: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
    },
  },
  description:
    '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    style: { className: null },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_2: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: true,
    isDeeplink: false,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      banner: {
        title: 'Código de envío',
        trackingCode: 'WALLA82U5I7Z',
      },
      linkUrl:
        'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
      title: 'Sigue tu envío',
    },
  },
  description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    style: { className: null },
  },
  showCaret: false,
};

const MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_3: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
    },
  },
  description:
    '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    thumbnailUrl:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
    style: { className: 'circle' },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_3: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: true,
    isDeeplink: false,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      banner: {
        title: 'Código de envío',
        trackingCode: 'WALLA82U5I7Z',
      },
      linkUrl:
        'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
      title: 'Sigue tu envío',
    },
  },
  description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    style: { className: 'rounded' },
  },
  showCaret: false,
};

export const MOCK_TRANSACTION_TRACKING: TransactionTracking = {
  header: MOCK_TRANSACTION_TRACKING_HEADER_1,
  shippingStatus: MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1,
  statusInfo: [MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1, MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_1],
};
export const MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS: TransactionTracking = {
  analytics: MOCK_TRANSACTION_TRACKING_ANALYTICS_2,
  header: MOCK_TRANSACTION_TRACKING_HEADER_2,
  shippingStatus: MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_2,
  statusInfo: [MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_2, MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_2],
};
export const MOCK_TRANSACTION_TRACKING_WITH_SUCCESS: TransactionTracking = {
  analytics: MOCK_TRANSACTION_TRACKING_ANALYTICS_2,
  header: MOCK_TRANSACTION_TRACKING_HEADER_2,
  shippingStatus: MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_3,
  statusInfo: [MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_3, MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_3],
};
