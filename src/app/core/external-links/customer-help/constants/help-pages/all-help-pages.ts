import { AllHelpPages } from '../../types/all-help-pages';
import { englishCustomerHelpPages } from './help-pages.en';
import { spanishCustomerHelpPages } from './help-pages.es';
import { italianCustomerHelpPages } from './help-pages.it';

export const allCustomerHelpPages: AllHelpPages = {
  en: englishCustomerHelpPages,
  es: spanishCustomerHelpPages,
  it: italianCustomerHelpPages,
};
