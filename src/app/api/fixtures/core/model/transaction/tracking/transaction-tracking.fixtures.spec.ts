import {
  TransactionTracking,
  TransactionTrackingCta,
  TransactionTrackingAnalytics,
  TransactionTrackingHeader,
  TransactionTrackingShippingStatus,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';

const MOCK_TRANSACTION_TRACKING_ANALYTICS_2: TransactionTrackingAnalytics = {
  buyer: { country: 'IT' },
  seller: { country: 'ES' },
};
const MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_1: TransactionTrackingCta = {
  action: {
    isDeeplink: true,
    analytics: {
      requestId: 'b7d11763-1c05-4cd8-9733-c3449807f644',
      source: 'Help General Doubts',
      userId: '77605037',
    },
    linkUrl: 'wallapop://customerSupport/faq/article?z=360013447218',
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
export const MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1: TransactionTrackingShippingStatus = {
  actions: [
    {
      action: {
        isDialog: true,
        description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
        negative: {
          title: 'Cancelar',
        },
        positive: {
          title: 'Confirmar',
          action: {
            isUserAction: true,
            name: 'PACKAGE_ARRIVED',
            success: {
              isDismiss: true,
            },
            transactionId: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
          },
        },
        title: '¿Confirmas que ya has recibido el producto?',
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
    isDeeplink: true,
    linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
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
export const MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1: TransactionTrackingStatusInfo = {
  action: {
    isCarrierTrackingWebview: true,
    linkUrl: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P',
    title: 'Sigue tu envío',
  },
  description: 'Código de envío<br><strong>PK55Z20727923640108018P</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    style: { className: null },
  },
  showCaret: false,
};
const MOCK_TRANSACTION_TRACKING_HEADER_DETAIL_2: TransactionTrackingCta = {
  action: {
    analytics: {
      requestId: '3d5d9154-1e52-4a99-87ee-bdedd7b1eb70',
      source: 'Help General Doubts',
      userId: '81497033',
    },
    isDeeplink: true,
    linkUrl: 'wallapop://customerSupport/faq/article?z=360013447218',
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
        isDialog: true,
        description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
        negative: { title: 'Cancelar' },
        positive: {
          title: 'Confirmar',
          action: {
            isUserAction: true,
            name: 'PACKAGE_ARRIVED',
            success: { isDismiss: true },
            transactionId: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
          },
        },
        title: '¿Confirmas que ya has recogido el producto?',
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
        isDialog: true,
        description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
        negative: { title: 'Cancelar' },
        positive: {
          action: {
            isUserAction: true,
            name: 'PACKAGE_ARRIVED',
            success: {
              isDismiss: true,
            },
            transactionId: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
          },
          title: 'Confirmar',
        },
        title: '¿Confirmas que ya has recogido el producto?',
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
export const MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_2: TransactionTrackingStatusInfo = {
  action: {
    isDeeplink: true,
    linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
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
    linkUrl:
      'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
    title: 'Sigue tu envío',
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
    isDeeplink: true,
    linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
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
    linkUrl:
      'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
    title: 'Sigue tu envío',
  },
  description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
  icon: {
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
    style: { className: 'rounded' },
  },
  showCaret: false,
};

const MOCK_TRANSACTION_TRACKING_ANALYTICS: TransactionTrackingAnalytics = {
  buyer: {
    country: 'IT',
  },
  seller: {
    country: 'ES',
  },
};

export const MOCK_TRANSACTION_TRACKING: TransactionTracking = {
  analytics: MOCK_TRANSACTION_TRACKING_ANALYTICS,
  header: MOCK_TRANSACTION_TRACKING_HEADER_1,
  shippingStatus: MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1,
  statusInfo: [MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1, MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_1],
};

const MOCK_TRANSACTION_TRACKING_HEADER_3: TransactionTrackingHeader = {
  detail: {
    action: {
      analytics: { requestId: 'c5df95b6-8cd5-4bdc-b430-42b125fa5a3d', source: 'Help General Doubts', userId: '81535033' },
      isDeeplink: true,
      linkUrl: 'wallapop://customerSupport/faq/article?z=360013342437',
    },
    state: { isDisabled: false },
    style: { className: 'btn btn-link' },
    title: 'Help',
  },
  title: 'Sale status',
};
const MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_WITH_UNKOWN_ACTION: TransactionTrackingShippingStatus = {
  actions: [
    { action: { isUnknown: true }, state: { isDisabled: true }, style: { className: 'btn btn-primary' }, title: 'View instructions' },
  ],
  animation: {
    isLoop: true,
    isLoopReverse: false,
    isNormal: false,
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_request_accepted_seller_animation_v2.json',
  },
  description: 'The information necessary to make the shipment is being generated; it could take a while.',
  title: 'Generating shipping data...',
};
const MOCK_TRANSACTION_TRACKING_STATUS_INFO_WITH_UNKOWN_ACTION: TransactionTrackingStatusInfo = {
  action: null,
  description: 'Generating shipping data...',
  icon: {
    style: { className: null },
    thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/Pending_registration%402x.png',
    url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/Pending_registration%402x.png',
  },
  showCaret: false,
};

export const MOCK_TRANSACTION_TRACKING_WITH_UNKOWN_ACTION: TransactionTracking = {
  analytics: MOCK_TRANSACTION_TRACKING_ANALYTICS,
  header: MOCK_TRANSACTION_TRACKING_HEADER_3,
  shippingStatus: MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_WITH_UNKOWN_ACTION,
  statusInfo: [MOCK_TRANSACTION_TRACKING_STATUS_INFO_WITH_UNKOWN_ACTION],
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
