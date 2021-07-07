import { KycInfoSliderStep } from '@private/features/wallet/interfaces/kyc-info-slider-step/kyc-info-slider-step.interface';

export const KYC_SLIDER_INFO_STEPS: KycInfoSliderStep[] = [
  {
    imageSrc: '/assets/images/kyc-banner/slide1.png',
    imageAlt: 'Credentials',
    title: $localize`:@@kyc_request_modal_slide_1_title:IMPORTANT!`,
    description: $localize`:@@kyc_request_modal_slide_1_description:The Anti-money Laundering Directive (EU) 2015/849 forces us to verify your identity in order to receive payment for your online sales. You will only need to verify yourself once.`,
  },
  {
    imageSrc: '/assets/images/kyc-banner/slide2.png',
    imageAlt: 'Bank account',
    title: $localize`:@@kyc_request_modal_slide_2_title:Step 1: Add or review your bank account`,
    description: $localize`:@@kyc_request_modal_slide_2_description:The first thing we'll ask you to do is enter your bank account details. If you already have one, check all data is ok. This is the account where you'll receive payment for your sales.`,
  },
  {
    imageSrc: '/assets/images/kyc-banner/slide3.png',
    imageAlt: 'Lock',
    title: $localize`:@@kyc_request_modal_slide_3_title:Step 2: Take a picture of your ID`,
    description: $localize`:@@kyc_request_modal_slide_3_description:So we can confirm that you are the bank account holder.`,
    additionalInfoText: $localize`:@@kyc_request_modal_slide_3_more_info_link:More info`,
  },
];
