import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

export const SUBSCRIPTION_IMAGES_FOLDER = 'assets/images/subscriptions/';

export const subscriptionBenefits: SubscriptionBenefit[] = [
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-1.svg`,
    title: $localize`:@@web_subscription_benefit_title_your_brand:Empower your brand`,
    description: $localize`:@@web_subscription_benefit_description_your_brand:Complete your profile with a cover photo and a description.`,
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-4.svg`,
    title: $localize`:@@web_subscription_benefit_title_connect:Connect with more customers`,
    description: $localize`:@@web_subscription_benefit_description_connect:Share your phone number and website with millions of people.`,
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-3.svg`,
    title: $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
    description: $localize`:@@web_subscription_benefit_description_visibility:Appear at the top of search results and attract more customers.`,
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-2.svg`,
    title: $localize`:@@web_subscription_benefit_title_time:Save management time`,
    description: $localize`:@@web_subscription_benefit_description_time:Your products will always be active and ready for sale.`,
  },
];
