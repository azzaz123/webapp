export interface ProModalConfig {
  title: string;
  img: string;
  text1: string;
  text2?: string;
  buttons: {
    primary: ButtonData;
    secondary?: ButtonData;
  };
}

interface ButtonData {
  text: string;
}

export enum MODAL_ACTION {
  PRIMARY_BUTTON,
  SECONDARY_BUTON,
}
