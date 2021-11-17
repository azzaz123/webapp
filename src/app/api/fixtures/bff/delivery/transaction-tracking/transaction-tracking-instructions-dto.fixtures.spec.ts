import { TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE: TransactionTrackingInstructionsDto = {
  navigation_title: 'Preparación del paquete',
  title: '¿Qué debes hacer ahora?',
  banner: {
    title: 'Código de envío',
    tracking_code: 'WALLAQBGG5RG',
  },
  instructions: [
    {
      description:
        'Empaqueta el producto de modo que quede bien protegido. Ten en cuenta las restricciones:<br><br><strong>• Peso:</strong> 2 kg máx.<br><br><strong>• Dimensiones:</strong> La suma del largo más el doble del alto y el doble del ancho no puede superar los 250 cm; y la mayor dimensión no puede superar los 100 cm.<br><br><span style="color: #13C1AC">Ver consejos de embalaje</span>',
      action: {
        action_type: 'deeplink',
        payload: {
          link_url: 'wallapop://customerSupport/faq/article?z=360019810637',
        },
        analytics: null,
      },
    },
    {
      description:
        'Llévalo al punto de entrega de <strong>Seur</strong> situado en <strong>CARMEN 15, 08001, Barcelona</strong> antes del <strong>15/08/2021</strong>.',
      action: null,
    },
    {
      description:
        '<strong>Descarga e imprime la etiqueta de envío</strong> cuando se haya generado. Pégala o adjúntala con el paquete. ¡No lo olvides!<br><br><span style="color: #13C1AC">Ver etiqueta de envío</span>',
      action: {
        action_type: 'deeplink',
        payload: {
          link_url:
            'wallapop://trackinglabel?url=https://delivery-printable-tags-test.beta.wallapop.com/00e1e595-560b-4619-a166-da88946bf05f.pdf',
        },
        analytics: null,
      },
    },
  ],
  extra_info: null,
  caption:
    '<span style="color: #607D8B">¿No quieres continuar? No te preocupes, puedes cancelar el envío. El comprador recibirá un reembolso del importe total.</span>',
  actions: [
    {
      title: 'Cancelar envío',
      style: 'outlined',
      state: 'enabled',
      action: {
        action_type: 'dialog',
        payload: {
          title_text: '¿Confirmas que no vas a enviar el producto?',
          description_text: 'Al confirmar, la transacción se cancelará y tu producto volverá a estar a la venta.',
          positive: {
            title: 'Confirmar',
            action: {
              action_type: 'user_action',
              payload: {
                name: 'CANCEL_TRANSACTION',
                parameters: {
                  transaction_id: '131093dd-5169-4ed3-b6ed-c0fa0c42952e',
                },
                on_success: {
                  action_type: 'dismiss',
                  payload: {},
                  analytics: null,
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
};
