import { TransactionTrackingGeneralInfo } from '@private/features/delivery/interfaces/TTS/transaction-tracking-general-info.interface';

export const MOCK_TRANSACTION_TRACKING_GENERAL_INFO: TransactionTrackingGeneralInfo = {
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
