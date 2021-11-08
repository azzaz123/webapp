import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';

export const MOCK_TRANSACTION_TRACKING: TransactionTracking = {
  header: {
    action: {
      analytics: {
        requestId: 'b7d11763-1c05-4cd8-9733-c3449807f644',
        source: 'Help General Doubts',
        userId: '77605037',
      },
      isCarrierTrackingWebview: false,
      isDeeplink: true,
      isDialog: false,
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
  },
  shippingStatus: {
    actions: [
      {
        action: {
          isCarrierTrackingWebview: false,
          isDeeplink: false,
          isDialog: true,
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
  },
  statusInfo: [
    {
      action: {
        isCarrierTrackingWebview: true,
        isDeeplink: false,
        isDialog: false,
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
    },
    {
      action: {
        isCarrierTrackingWebview: false,
        isDeeplink: true,
        isDialog: false,
        isUserAction: false,
        payload: {
          linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
        },
      },
      description:
        '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
      icon: {
        url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        thumbnailUrl:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        style: {
          className: null,
        },
      },
      showCaret: false,
    },
  ],
  title: 'Estado de tu compra',
};
