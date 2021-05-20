export type ItemCondition = 'un_opened' | 'un_worn' | 'in_box' | 'new' | 'as_good_as_new' | 'good' | 'fair' | 'has_given_it_all';

export const getTranslatedItemCondition = (condition: ItemCondition): string => {
  switch (condition) {
    case 'un_opened':
      return $localize`:@@web_condition_un_opened:Unopened`;
    case 'un_worn':
      return $localize`:@@web_condition_unworn:Unworn`;
    case 'in_box':
      return $localize`:@@web_condition_in_box:In its box`;
    case 'new':
      return $localize`:@@web_new:New`;
    case 'as_good_as_new':
      return $localize`:@@web_condition_as_good_as_new:As good as new`;
    case 'good':
      return $localize`:@@web_good_condition:Good condition`;
    case 'fair':
      return $localize`:@@web_condition_fair:Fair condition`;
    case 'has_given_it_all':
      return $localize`:@@web_condition_has_given_it_all:May have to be repaired`;
    default:
      return $localize`:@@web_undefined:Undefined`;
  }
};
