import { ProModalConfig } from './pro-modal.interface';

export enum PRO_MODAL_TYPE {
  simulation,
}

export const modalConfig: Record<PRO_MODAL_TYPE, ProModalConfig> = {
  [PRO_MODAL_TYPE.simulation]: {
    img: '/assets/icons/pro/modals/pop-in-person.svg',
    title: 'simulacro',
    text1: 'La función de agregar servicios adicionales todavía no existe, estamos valorando posibilidades.',
    text2: '¡Gracias por tu ayuda! Tu participación ha sido muy valiosa. Nos ayudará a crear esta funcionalidad.',
    buttons: {
      primary: {
        text: 'OK',
      },
    },
  },
};
