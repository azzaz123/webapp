export interface Toast {
  text: string;
  title?: string;
  type: TOAST_TYPES;
}

export enum TOAST_TYPES {
  SUCCESS = 'success',
  ERROR = 'error',
}
