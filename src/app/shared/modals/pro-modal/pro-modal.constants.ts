import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { MODAL_STYLE, ProModalConfig, REDIRECT_TYPE } from './pro-modal.interface';

export enum PRO_MODAL_TYPE {
  simulation,
  listing_limit_cars_highest_limit,
  listing_limit_real_estate_highest_limit,
  listing_limit_consumer_good_highest_limit,
  listing_limit_tier_limit,
  listing_limit_no_trial_no_discount,
  listing_limit_trial,
  listing_limit_discount,
  reactivation,
  profile_pro_fields,
  remove_card,
  confirm_change_card,
  cancel_subscription,
  continue_subscription,
  bump_success,
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
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_understood_button:Understood` },
      primary: { text: $localize`:@@listing_limit_pro_user_real_estate_subscription_modal_more_info_button:More info` },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_consumer_good_highest_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_cg_subscription_modal_title:You've reached the subscription's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_cg_subscription_modal_description:It’s not possible to have so many items for sale at the same time. The item will be listed to your catalog, but it will remain inactive.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_cg_subscription_modal_understood_button:Understood` },
      primary: { text: $localize`:@@listing_limit_pro_user_cg_subscription_modal_more_info_button:More info` },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_cars_highest_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_cars_subscription_modal_title:You've reached the subscription's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_cars_subscription_modal_description_1:In order to have more cars for sale, you need to contact our sales team.`,
    text2: $localize`:@@listing_limit_pro_user_cars_subscription_modal_description_2:If you decide to keep with your plan, this item will become inactive – nobody will be able to buy it.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_pro_user_cars_subscription_modal_dismiss_button:Leave as inactive` },
      primary: {
        text: $localize`:@@listing_limit_pro_user_cars_subscription_modal_contact_button:Contact sales team`,
        redirect: { type: REDIRECT_TYPE.href, url: 'mailto:contacto.motor@wallapop.com' },
      },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_tier_limit]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_pro_user_upgrade_tier_modal_title:You've reached your plan's listing limit`,
    text1: $localize`:@@listing_limit_pro_user_upgrade_tier_modal_description_1:To list more items of this category upgrade your subscription plan. You will sell more!`,
    text2: $localize`:@@listing_limit_pro_user_upgrade_tier_modal_description_2:If you choose to keep your plan, this item will become inactive – nobody will be able to buy it.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: {
        text: $localize`:@@listing_limit_pro_user_upgrade_tier_modal_dismiss_button:Leave as inactive`,
      },
      primary: {
        text: $localize`:@@listing_limit_pro_user_upgrade_tier_modal_view_plans_button:View plans`,
        redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` },
      },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_no_trial_no_discount]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_title:You've reached the free listing limit`,
    text1: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_description_part_1:Want to list more items of this category? You might be interested in signing up for wallapop PRO. Professionalise your online sales, and sell more!`,
    text2: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_description_part_2:If you decide wallapop PRO isn't for you, this item will become inactive – nobody will be able to buy it.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_dismiss_button:Leave as inactive` },
      primary: {
        text: $localize`:@@listing_limit_non_pro_users_no_free_trial_modal_view_plans_button:View plans`,
        redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` },
      },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_trial]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_non_pro_users_free_trial_available_title:You've reached the free listing limit`,
    text1: null,
    text2: $localize`:@@listing_limit_non_pro_users_free_trial_available_description_part_2:If you decide wallapop PRO isn't for you, this item will become inactive – nobody will be able to buy it.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_non_pro_users_free_trial_available_dismiss_button:Leave as inactive` },
      primary: {
        text: $localize`:@@listing_limit_non_pro_users_free_trial_available_ok_button:Start free trial`,
        redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` },
      },
    },
  },
  [PRO_MODAL_TYPE.listing_limit_discount]: {
    img: '/assets/icons/pro/modals/listing-limit.svg',
    title: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_title:You've reached the free listing limit`,
    text1: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_description_part_1:Want to list more items of this category? You might be interested in signing up for wallapop PRO. Professionalise your online sales, and sell more!`,
    text2: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_description_part_2:If you decide wallapop PRO isn't for you, this item will become inactive – nobody will be able to buy it.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@listing_limit_non_pro_users_discount_or_no_free_trial_modal_dismiss_button:Leave as inactive` },
      primary: { text: null, redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` } },
    },
  },
  [PRO_MODAL_TYPE.profile_pro_fields]: {
    img: '/assets/icons/pro/modals/pro-fields.svg',
    title: $localize`:@@web_suggest_pro_modal_description_plans:Choose a plan and take advantage of Wallapop PRO benefits.`,
    text1: null,
    textList: [
      $localize`:@@web_profile_modal_become_pro_231:Your products will be seen more: they will be in the first position of the searches`,
      $localize`:@@web_profile_modal_become_pro_232:Buyers can save your shop/profile as a favorite`,
      $localize`:@@web_profile_modal_become_pro_233:Buyers will be able to see your phone and website in your profile for easy contact`,
      $localize`:@@web_profile_modal_become_pro_234:You will have a description of your store or service and its location`,
      $localize`:@@web_profile_modal_become_pro_235:Your profile will have a different design and will stand out!`,
      $localize`:@@web_profile_modal_become_pro_236:Your items won't expire`,
    ],
    buttons: {
      primary: {
        text: $localize`:@@web_see_plans:See plans`,
        redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` },
      },
    },
  },
  [PRO_MODAL_TYPE.reactivation]: {
    img: '/assets/icons/pro/modals/reactivation.svg',
    title: $localize`:@@pro_after_reactivation_non_subscribed_user_title:Item reactivated!`,
    text1: $localize`:@@pro_after_reactivation_non_subscribed_user_free_trial_description_1_2v:If you were PRO your items wouldn’t become inactive. Sounds good, right?`,
    text2: $localize`:@@pro_after_reactivation_non_subscribed_user_description_2:Choose a plan and take advantage of Wallapop PRO benefits.`,
    buttons: {
      secondary: { text: $localize`:@@pro_after_reactivation_non_subscribed_user_reject_button:Not now thanks` },
      primary: {
        text: $localize`:@@pro_after_reactivation_non_subscribed_user_view_plans_button:View plans`,
        redirect: { type: REDIRECT_TYPE.routerLink, url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}` },
      },
    },
  },
  [PRO_MODAL_TYPE.remove_card]: {
    img: '/assets/icons/pro/modals/confirm-change-card.svg',
    title: $localize`:@@web_missing_payment_method_title:Delete payment method`,
    text1: $localize`:@@web_missing_payment_method_subtitle:Without a card linked to your subscriptions, you won't be able to renew them and you will lose the benefits of being PRO. Is that what you want?`,
    buttons: {
      secondary: { text: $localize`:@@web_cancel:Cancel` },
      primary: { text: $localize`:@@web_confirm_delete_card:Yes, delete card` },
    },
  },
  [PRO_MODAL_TYPE.confirm_change_card]: {
    img: '/assets/icons/pro/modals/confirm-change-card.svg',
    title: $localize`:@@bank_card_change_confirm_modal_pro_user_title:This is your payment method`,
    text1: $localize`:@@bank_card_change_confirm_modal_pro_user_description:The card you've associated has this last four digits: ${'XXXX'}:INTERPOLATION:.`,
    buttons: {
      secondary: { text: $localize`:@@web_cancel:Cancel` },
      primary: { text: $localize`:@@bank_card_change_confirm_modal_pro_user_confirm_button:Confirm` },
    },
  },
  [PRO_MODAL_TYPE.cancel_subscription]: {
    img: '/assets/icons/pro/modals/cancel-subscription.svg',
    title: $localize`:@@cancel_subscription_modal_pro_user_title:Want to cancel your subscription?`,
    text1: $localize`:@@cancel_subscription_modal_pro_user_description:We are sorry you leave. If you cancel your subscription right now, you will continue enjoying their benefits until the expiration date.`,
    style: MODAL_STYLE.GREEN,
    buttons: {
      secondary: { text: $localize`:@@cancel_subscription_modal_pro_user_keep_button:Keep subscription` },
      primary: { text: $localize`:@@cancel_subscription_modal_pro_user_confirm_cancelation_button:Cancel subscription` },
    },
  },
  [PRO_MODAL_TYPE.continue_subscription]: {
    img: '/assets/icons/pro/modals/continue-subscription.svg',
    title: null,
    text1: $localize`:@@web_profile_modal_continue_subscription_245:It’s never too late! You can undo the cancelation and keep enjoying the benefits.`,
    buttons: {
      secondary: { text: $localize`:@@cancel_subscription_modal_pro_user_confirm_cancelation_button:Cancel subscription` },
      primary: { text: $localize`:@@cancel_subscription_modal_pro_user_keep_button:Keep subscription` },
    },
  },
  [PRO_MODAL_TYPE.bump_success]: {
    img: '/assets/icons/pro/modals/bump-success.svg',
    title: $localize`:@@bump_selector_view_confirmation_modal_pro_user_title:Your item has been highlighted`,
    text1: $localize`:@@bump_selector_view_confirmation_modal_pro_user_descripton_1_part:It's now more visible, so you will receive more visits than ever before. Go for it!`,
    buttons: {
      primary: { text: $localize`:@@bump_selector_view_confirmation_modal_pro_user_understood_button:Understood` },
    },
  },
};
