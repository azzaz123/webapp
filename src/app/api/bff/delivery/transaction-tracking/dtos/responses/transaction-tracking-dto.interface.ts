export interface TransactionTrackingDto {
  title: string;
  top_action: TransactionTrackingTopAction;
  shipping_status: {
    title: 'Paquete en reparto';
    description: 'Llegará en un plazo estimado de <strong>3 días hábiles.</strong> ¡Que pasen rápido! ';
    animation: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_in_transit_animation.json';
      mode: 'loop';
    };
    actions: [
      {
        title: 'Ya lo he recibido';
        style: 'contained';
        state: 'enabled';
        action: {
          action_type: 'dialog';
          payload: {
            title_text: '¿Confirmas que ya has recibido el producto?';
            description_text: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!';
            positive: {
              title: 'Confirmar';
              action: {
                action_type: 'user_action';
                payload: {
                  name: 'PACKAGE_ARRIVED';
                  parameters: {
                    transaction_id: '10514fe3-8cd5-4fd5-a85e-8a068b6ba9af';
                  };
                };
                analytics: null;
              };
            };
            negative: { title: 'Cancelar' };
          };
          analytics: null;
        };
      }
    ];
  };
  transaction_status_info: [
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png';
        thumbnail_url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png';
        style: 'none';
      };
      description: 'Código de envío<br><strong>PK55Z20727923640108018P</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>';
      action_icon: 'none';
      action: {
        action_type: 'carrier_tracking_webview';
        payload: {
          title: 'Sigue tu envío';
          link_url: 'https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK55Z20727923640108018P';
          banner: {
            title: 'Código de envío';
            tracking_code: 'PK55Z20727923640108018P';
          };
        };
        analytics: null;
      };
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png';
        thumbnail_url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png';
        style: 'none';
      };
      description: '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>';
      action_icon: 'none';
      action: {
        action_type: 'deeplink';
        payload: {
          link_url: 'wallapop://customerSupport/faq/article?z=360001796618';
        };
        analytics: null;
      };
    }
  ];
}

interface TransactionTrackingAction {
  action_type: string;
  payload: {
    link_url: string;
  };
  analytics: {
    user_id: string;
    request_id: string;
    source: string;
  };
}

interface TransactionTrackingTopAction {
  title: string;
  style: string;
  state: string;
  action: TransactionTrackingAction;
}
