import { COLORS } from '@core/colors/colors-constants';

export interface ConfirmationModalProperties {
  title?: string;
  description: string;
  confirmMessage: string;
  cancelMessage?: string;
  confirmColor: COLORS.WALLA_MAIN | COLORS.NEGATIVE_MAIN;
}
