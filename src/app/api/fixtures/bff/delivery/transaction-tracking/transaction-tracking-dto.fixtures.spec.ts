import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export const MOCK_TRANSACTION_TRACKING_DTO_RESPONSE: TransactionTrackingDto = {
  title: 'Estado de tu compra',
  top_action: {
    title: '¿Dudas?',
    style: 'text',
    state: 'enabled',
    action: {
      action_type: 'deeplink',
      payload: {
        link_url: 'wallapop://customerSupport/faq/article?z=360013447218',
      },
      analytics: {
        user_id: '77605037',
        request_id: 'b7d11763-1c05-4cd8-9733-c3449807f644',
        source: 'Help General Doubts',
      },
    },
  },
  shipping_status: {
    title: 'Paquete en reparto',
    description: 'Llegará en un plazo estimado de <strong>3 días hábiles.</strong> ¡Que pasen rápido! ',
    animation: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_in_transit_animation.json',
      mode: 'loop',
    },
    actions: [
      {
        title: 'Ya lo he recibido',
        style: 'contained',
        state: 'enabled',
        action: {
          action_type: 'dialog',
          payload: {
            title_text: '¿Confirmas que ya has recibido el producto?',
            description_text: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
            positive: {
              title: 'Confirmar',
              action: {
                action_type: 'user_action',
                payload: {
                  name: 'PACKAGE_ARRIVED',
                  parameters: {
                    transaction_id: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af',
                  },
                },
                analytics: null,
              },
            },
            negative: { title: 'Cancelar' },
          },
          analytics: null,
        },
      },
    ],
  },
  transaction_status_info: [
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        thumbnail_url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        style: 'none',
      },
      description: 'Código de envío<br><strong>PK55Z20727923640108018P</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
      action_icon: 'none',
      action: {
        action_type: 'carrier_tracking_webview',
        payload: {
          title: 'Sigue tu envío',
          link_url: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P',
          banner: {
            title: 'Código de envío',
            tracking_code: 'PK55Z20727923640108018P',
          },
        },
        analytics: null,
      },
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        style: 'none',
      },
      description:
        '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
      action_icon: 'none',
      action: {
        action_type: 'deeplink',
        payload: {
          link_url: 'wallapop://customerSupport/faq/article?z=360001796618',
        },
        analytics: null,
      },
    },
  ],
};
export const MOCK_TRANSACTION_TRACKING_WITH_ANALYTICS_DTO_RESPONSE: TransactionTrackingDto = {
  title: 'Estado de tu compra',
  top_action: {
    title: '¿Dudas?',
    style: 'text',
    state: 'enabled',
    action: {
      action_type: 'deeplink',
      payload: {
        link_url: 'wallapop://customerSupport/faq/article?z=360013447218',
      },
      analytics: {
        user_id: '81497033',
        request_id: '3d5d9154-1e52-4a99-87ee-bdedd7b1eb70',
        source: 'Help General Doubts',
      },
    },
  },
  shipping_status: {
    title: '¡Paquete listo para recoger!',
    description:
      'Tu compra te espera en el punto de recogida situado en <strong>Via XXIV Maggio 76, 03037, Pontecorvo</strong>.<br><br>La fecha límite de recogida es el <strong>04/09/2021</strong>. Superado el plazo, será devuelto al vendedor y la transacción se cancelará.',
    animation: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_available_for_the_recipient_carrier_office_delivery_buyer_animation.json',
      mode: 'loop',
    },
    actions: [
      {
        title: 'Ya lo he recogido',
        style: 'contained',
        state: 'enabled',
        action: {
          action_type: 'dialog',
          payload: {
            title_text: '¿Confirmas que ya has recogido el producto?',
            description_text: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
            positive: {
              title: 'Confirmar',
              action: {
                action_type: 'user_action',
                payload: {
                  name: 'PACKAGE_ARRIVED',
                  parameters: {
                    transaction_id: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
                  },
                },
                analytics: null,
              },
            },
            negative: {
              title: 'Cancelar',
            },
          },
          analytics: null,
        },
      },
    ],
  },
  transaction_status_info: [
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        thumbnail_url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        style: 'none',
      },
      description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
      action_icon: 'none',
      action: {
        action_type: 'carrier_tracking_webview',
        payload: {
          title: 'Sigue tu envío',
          link_url:
            'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
          banner: {
            title: 'Código de envío',
            tracking_code: 'WALLA82U5I7Z',
          },
        },
        analytics: null,
      },
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        style: 'none',
      },
      description:
        '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
      action_icon: 'none',
      action: {
        action_type: 'deeplink',
        payload: {
          link_url: 'wallapop://customerSupport/faq/article?z=360001796618',
        },
        analytics: null,
      },
    },
  ],
  analytics: {
    seller_country: 'ES',
    buyer_country: 'IT',
  },
};
export const MOCK_TRANSACTION_TRACKING_WITH_SUCCESS_DTO_RESPONSE: TransactionTrackingDto = {
  title: 'Estado de tu compra',
  top_action: {
    title: '¿Dudas?',
    style: 'text',
    state: 'enabled',
    action: {
      action_type: 'deeplink',
      payload: {
        link_url: 'wallapop://customerSupport/faq/article?z=360013447218',
      },
      analytics: {
        user_id: '81497033',
        request_id: '3d5d9154-1e52-4a99-87ee-bdedd7b1eb70',
        source: 'Help General Doubts',
      },
    },
  },
  shipping_status: {
    title: '¡Paquete listo para recoger!',
    description:
      'Tu compra te espera en el punto de recogida situado en <strong>Via XXIV Maggio 76, 03037, Pontecorvo</strong>.<br><br>La fecha límite de recogida es el <strong>04/09/2021</strong>. Superado el plazo, será devuelto al vendedor y la transacción se cancelará.',
    animation: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_available_for_the_recipient_carrier_office_delivery_buyer_animation.json',
      mode: 'loop',
    },
    actions: [
      {
        title: 'Ya lo he recogido',
        style: 'contained',
        state: 'enabled',
        action: {
          action_type: 'dialog',
          payload: {
            title_text: '¿Confirmas que ya has recogido el producto?',
            description_text: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
            positive: {
              title: 'Confirmar',
              action: {
                action_type: 'user_action',
                payload: {
                  name: 'PACKAGE_ARRIVED',
                  parameters: {
                    transaction_id: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
                  },
                  on_success: {
                    action_type: 'dismiss',
                    payload: {},
                  },
                },
                analytics: null,
              },
            },
            negative: {
              title: 'Cancelar',
            },
          },
          analytics: null,
        },
      },
    ],
  },
  transaction_status_info: [
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        thumbnail_url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
        style: 'rounded',
      },
      description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
      action_icon: 'none',
      action: {
        action_type: 'carrier_tracking_webview',
        payload: {
          title: 'Sigue tu envío',
          link_url:
            'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
          banner: {
            title: 'Código de envío',
            tracking_code: 'WALLA82U5I7Z',
          },
        },
        analytics: null,
      },
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
        style: 'circle',
      },
      description:
        '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
      action_icon: 'none',
      action: {
        action_type: 'deeplink',
        payload: {
          link_url: 'wallapop://customerSupport/faq/article?z=360001796618',
        },
        analytics: null,
      },
    },
  ],
  analytics: {
    seller_country: 'ES',
    buyer_country: 'IT',
  },
};
