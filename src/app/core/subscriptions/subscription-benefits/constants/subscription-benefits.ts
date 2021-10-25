import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

export const subscriptionBenefits: SubscriptionBenefit[] = [
  {
    iconPath: `img-1.png`,
    title: $localize`:@@web_subscription_benefit_title_your_brand:Empower your brand`,
    description: $localize`:@@web_subscription_benefit_description_your_brand:Complete your profile with a cover photo and a description.`,
  },
  {
    iconPath: `img-2.png`,
    title: $localize`:@@web_subscription_benefit_title_connect:Connect with more customers`,
    description: $localize`:@@web_subscription_benefit_description_connect:Share your phone number and website with millions of people.`,
  },
  {
    iconPath: `img-3.png`,
    title: $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
    description: $localize`:@@web_subscription_benefit_description_visibility:Appear at the top of search results and attract more customers.`,
  },
  {
    iconPath: `img-4.png`,
    title: $localize`:@@web_subscription_benefit_title_time:Save management time`,
    description: $localize`:@@web_subscription_benefit_description_time:Your products will always be active and ready for sale.`,
  },
];
