import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

export const SUBSCRIPTION_IMAGES_FOLDER = 'assets/images/subscriptions/';

export const subscriptionBenefits: SubscriptionBenefit[] = [
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-1.svg`,
    title: 'Empower your brand',
    description: 'Complete your profile with a cover photo and a description.',
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-4.svg`,
    title: 'Connect with more customers',
    description: 'Share your phone number and website with millions of people.',
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-3.svg`,
    title: 'Gain more visibility',
    description: 'Appear at the top of search results and attract more customers.',
  },
  {
    iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}img-2.svg`,
    title: 'Save management time',
    description: 'Your products will always be active and ready for sale.',
  },
];
