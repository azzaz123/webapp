import { ERROR_BOX_EXIT_TYPE } from '@shared/error-box/interfaces/error-box-exit-type';
import { ErrorBoxExit } from '@shared/error-box/interfaces/error-box-exit.interface';

export const MOCK_ERROR_BOX_EXIT_BUTTON: ErrorBoxExit = {
  type: ERROR_BOX_EXIT_TYPE.BUTTON,
  label: 'Ver productos',
};
export const MOCK_ERROR_BOX_EXIT_LINK: ErrorBoxExit = {
  type: ERROR_BOX_EXIT_TYPE.LINK,
  label: 'Ver productos',
};
