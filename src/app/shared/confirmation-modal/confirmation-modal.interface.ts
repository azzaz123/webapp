import { COLORS } from '@core/colors/colors-constants';

export interface ConfirmationModalProperties {
  title?: string;
  description: string;
  confirmMessage: string;
  confirmColor: CONFIRM_COLOR_TYPES;
}

export enum CONFIRM_COLOR_TYPES {
  GREEN = COLORS.WALLA_MAIN,
  RED = COLORS.NEGATIVE_MAIN,
}
