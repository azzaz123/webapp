import { KYC_MODAL_STATUS } from '@private/features/wallet/modals/kyc/enums/kyc-modal-status.enum';
import { KYCModalProperties } from '@private/features/wallet/modals/kyc/interfaces/kyc-modal-properties.interface';

export const MOCK_KYC_MODAL_ERROR_PROPERTIES: KYCModalProperties = {
  status: KYC_MODAL_STATUS.ERROR,
  title: 'Error title',
  description: 'Description',
  svgPath: 'svgPath',
  messageCTA: 'messageCTA',
  showZendeskLink: true,
  refusedMessage: 'refusedMessage',
};

export const MOCK_KYC_MODAL_SUCCEED_PROPERTIES: KYCModalProperties = {
  status: KYC_MODAL_STATUS.SUCCEED,
  title: 'Nais',
  description: 'Description',
  svgPath: 'svgPath',
  messageCTA: 'messageCTA',
};
