import { ProModalConfig } from './pro-modal.interface';

export enum PRO_MODAL_TYPE {
  simulation,
}

export const modalConfig: Record<PRO_MODAL_TYPE, ProModalConfig> = {
  [PRO_MODAL_TYPE.simulation]: {
    img: '/assets/icons/pro/modals/pop-in-person.svg',
    title: $localize`:@@additional_services_selector_pro_user_smoke_test_modal_title:This was a test, services haven't been added`,
    text1: $localize`:@@additional_services_selector_pro_user_smoke_test_modal_part_1_description:The feature doesn't yet exist, we are evaluating their possibilities.`,
    text2: $localize`:@@additional_services_selector_pro_user_smoke_test_modal_part_2_description:We appreciate your participation. It will help us to make this feature real. Thanks!`,
    buttons: {
      primary: { text: $localize`:@@additional_services_selector_pro_user_smoke_test_modal_ok_button:Understood` },
    },
  },
};
