import { ProModalConfig } from './pro-modal.interface';

export enum PRO_MODAL_TYPE {
  simulation,
  listing_limit_cars_highest_limit,
  listing_limit_real_estate_highest_limit,
  listing_limit_consumer_good_highest_limit,
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
  [PRO_MODAL_TYPE.listing_limit_real_estate_highest_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_title:You've reached the subscription's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_description:It’s not possible to have so many Real Estate items for sale at the same time. The item will be listed to your catalog, but it will remain inactive.`,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_understood_button:Understood` },
      primary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_more_info_button:More info` },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_consumer_good_highest_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_title:You've reached the subscription's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_description:It’s not possible to have so many Real Estate items for sale at the same time. The item will be listed to your catalog, but it will remain inactive.`,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_understood_button:Understood` },
      primary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_more_info_button:More info` },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_cars_highest_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_title:You've reached the subscription's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_description:It’s not possible to have so many Real Estate items for sale at the same time. The item will be listed to your catalog, but it will remain inactive.`,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_understood_button:Understood` },
      primary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_more_info_button:More info` },
    },
  },
};
