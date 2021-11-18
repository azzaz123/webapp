import {
  TransactionTrackingAction,
  TransactionTrackingAdditionalInfo,
  TransactionTrackingBanner,
  TransactionTrackingHeader,
  TransactionTrackingInstruction,
  TransactionTrackingInstructions,
  TransactionTrackingInstructionsBody,
  TransactionTrackingInstructionsFooter,
} from '@api/core/model/delivery/transaction/tracking';

const MOCK_TRANSACTION_TRACKING_BANNER_1: TransactionTrackingBanner = { title: 'Código de envío', trackingCode: 'WALLAQBGG5RG' };

const MOCK_TRANSACTION_TRACKING_INSTRUCTION_1: TransactionTrackingInstruction = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://customerSupport/faq/article?z=360019810637',
    },
  },
  description:
    'Empaqueta el producto de modo que quede bien protegido. Ten en cuenta las restricciones:<br><br><strong>• Peso:</strong> 2 kg máx.<br><br><strong>• Dimensiones:</strong> La suma del largo más el doble del alto y el doble del ancho no puede superar los 250 cm; y la mayor dimensión no puede superar los 100 cm.<br><br><span style="color: #13C1AC">Ver consejos de embalaje</span>',
};
const MOCK_TRANSACTION_TRACKING_INSTRUCTION_2: TransactionTrackingInstruction = {
  description:
    'Llévalo al punto de entrega de <strong>Seur</strong> situado en <strong>CARMEN 15, 08001, Barcelona</strong> antes del <strong>15/08/2021</strong>.',
};
const MOCK_TRANSACTION_TRACKING_INSTRUCTION_3: TransactionTrackingInstruction = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl:
        'wallapop://trackinglabel?url=https://delivery-printable-tags-test.beta.wallapop.com/00e1e595-560b-4619-a166-da88946bf05f.pdf',
    },
  },
  description:
    '<strong>Descarga e imprime la etiqueta de envío</strong> cuando se haya generado. Pégala o adjúntala con el paquete. ¡No lo olvides!<br><br><span style="color: #13C1AC">Ver etiqueta de envío</span>',
};

const MOCK_TRANSACTION_TRACKING_ADDITIONAL_INFO_1: TransactionTrackingAdditionalInfo = {
  description: 'Aquí va la descripción de la información extra que queremos mostrar',
  title: 'Este es el título de la información extra',
};

const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_BODY_1: TransactionTrackingInstructionsBody = {
  additionalInfo: null,
  banner: MOCK_TRANSACTION_TRACKING_BANNER_1,
  instructions: [MOCK_TRANSACTION_TRACKING_INSTRUCTION_1, MOCK_TRANSACTION_TRACKING_INSTRUCTION_2, MOCK_TRANSACTION_TRACKING_INSTRUCTION_3],
  title: '¿Qué debes hacer ahora?',
};
const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_BODY_2: TransactionTrackingInstructionsBody = {
  additionalInfo: MOCK_TRANSACTION_TRACKING_ADDITIONAL_INFO_1,
  banner: MOCK_TRANSACTION_TRACKING_BANNER_1,
  instructions: [MOCK_TRANSACTION_TRACKING_INSTRUCTION_1, MOCK_TRANSACTION_TRACKING_INSTRUCTION_2, MOCK_TRANSACTION_TRACKING_INSTRUCTION_3],
  title: '¿Qué debes hacer ahora?',
};

const MOCK_TRANSACTION_TRACKING_FOOTER_ACTION_1: TransactionTrackingAction = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: false,
    isDialog: true,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      description: 'Al confirmar, la transacción se cancelará y tu producto volverá a estar a la venta.',
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
            name: 'CANCEL_TRANSACTION',
            parameters: {
              transactionId: '131093dd-5169-4ed3-b6ed-c0fa0c42952e',
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
      title: '¿Confirmas que no vas a enviar el producto?',
    },
  },
  state: { isDisabled: false },
  style: { className: 'btn btn-secondary' },
  title: 'Cancelar envío',
};

const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_FOOTER_1: TransactionTrackingInstructionsFooter = {
  description:
    '<span style="color: #607D8B">¿No quieres continuar? No te preocupes, puedes cancelar el envío. El comprador recibirá un reembolso del importe total.</span>',
  actions: [MOCK_TRANSACTION_TRACKING_FOOTER_ACTION_1],
};

const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_HEADER_1: TransactionTrackingHeader = { title: 'Preparación del paquete' };

export const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS: TransactionTrackingInstructions = {
  body: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_BODY_1,
  footer: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_FOOTER_1,
  header: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_HEADER_1,
};
export const MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO: TransactionTrackingInstructions = {
  body: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_BODY_2,
  footer: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_FOOTER_1,
  header: MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_HEADER_1,
};
