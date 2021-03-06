export interface ProModalConfig {
  style?: MODAL_STYLE;
  title: string;
  img: string;
  text1: string;
  text2?: string;
  textList?: string[];
  buttons: {
    primary: ButtonData;
    secondary?: ButtonData;
  };
}

interface ButtonData {
  text: string;
  redirect?: RedirectData;
}
export enum MODAL_STYLE {
  BLUE = 'blue',
  GREEN = 'green',
}

export enum MODAL_ACTION {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
}

interface RedirectData {
  type: REDIRECT_TYPE;
  url: string;
}

export enum REDIRECT_TYPE {
  href,
  routerLink,
}
