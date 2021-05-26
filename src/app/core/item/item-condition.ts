export enum ItemCondition {
  UN_OPENED = 'un_opened',
  UN_WORN = 'un_worn',
  IN_BOX = 'in_box',
  NEW = 'new',
  AS_GOOD_AS_NEW = 'as_good_as_new',
  GOOD = 'good',
  FAIR = 'fair',
  HAS_GIVEN_IT_ALL = 'has_given_it_all',
}

export const itemConditionTranslations: Record<ItemCondition, string> = {
  [ItemCondition.UN_OPENED]: $localize`:@@web_condition_un_opened:Unopened`,
  [ItemCondition.UN_WORN]: $localize`:@@web_condition_unworn:Unworn`,
  [ItemCondition.IN_BOX]: $localize`:@@web_condition_in_box:In its box`,
  [ItemCondition.NEW]: $localize`:@@web_new:New`,
  [ItemCondition.AS_GOOD_AS_NEW]: $localize`:@@web_condition_as_good_as_new:As good as new`,
  [ItemCondition.GOOD]: $localize`:@@web_good_condition:Good condition`,
  [ItemCondition.FAIR]: $localize`:@@web_condition_fair:Fair condition`,
  [ItemCondition.HAS_GIVEN_IT_ALL]: $localize`:@@web_condition_has_given_it_all:May have to be repaired`,
};

export const defaultItemConditionTranslation = $localize`:@@web_undefined:Undefined`;

export const getTranslatedItemCondition = (condition: ItemCondition): string => {
  const translatedItemCondition = itemConditionTranslations[condition];
  return translatedItemCondition || defaultItemConditionTranslation;
};
