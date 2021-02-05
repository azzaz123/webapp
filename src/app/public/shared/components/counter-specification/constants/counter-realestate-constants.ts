import { ItemSpecification } from '@public/core/constants/item-specifications-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { REAL_ESTATE_ICON } from './icons-realestate-constants';

export const REAL_ESTATE_NUMERIC_SPECIFICATION: ItemSpecification[] = [
  {
    type: REAL_STATE_TYPE.BATHROOMS,
    label: {
      singular: $localize`:@@Bathroom:Bathroom`,
      plural: $localize`:@@Bathrooms:Bathrooms`,
    },
  },
  {
    type: REAL_STATE_TYPE.ROOMS,
    label: {
      singular: $localize`:@@Room:Room`,
      plural: $localize`:@@Rooms:Rooms`,
    },
  },
  {
    type: REAL_STATE_TYPE.SURFACE,
    label: { singular: 'm2' },
  },
];

export const REAL_ESTATE_ICON_SPEC_TRANSLATION: ItemSpecification[] = [
  {
    icon: REAL_ESTATE_ICON.GARAGE,
    label: { singular: $localize`:@@Garage:Garage` },
    type: REAL_STATE_TYPE.GARAGE,
  },
  {
    icon: REAL_ESTATE_ICON.ELEVATOR,
    label: { singular: $localize`:@@Elevator:Elevator` },
    type: REAL_STATE_TYPE.ELEVATOR,
  },
  {
    icon: REAL_ESTATE_ICON.GARDEN,
    label: { singular: $localize`:@@Garden:Garden` },
    type: REAL_STATE_TYPE.GARDEN,
  },
  {
    icon: REAL_ESTATE_ICON.POOL,
    label: { singular: $localize`:@@Pool:Pool` },
    type: REAL_STATE_TYPE.POOL,
  },
  {
    icon: REAL_ESTATE_ICON.TERRACE,
    label: { singular: $localize`:@@Terrace:Terrace` },
    type: REAL_STATE_TYPE.TERRACE,
  },
  {
    icon: REAL_ESTATE_ICON.FLAT,
    type: REAL_STATE_TYPE.FLAT,
    label: { singular: $localize`:@@Flat:Flat` },
  },
  {
    icon: REAL_ESTATE_ICON.HOUSE,
    type: REAL_STATE_TYPE.HOUSE,
    label: { singular: $localize`:@@House:House` },
  },
  {
    icon: REAL_ESTATE_ICON.OFFICE,
    type: REAL_STATE_TYPE.OFFICE,
    label: { singular: $localize`:@@Office:Premises/Office` },
  },
  {
    icon: REAL_ESTATE_ICON.LAND,
    type: REAL_STATE_TYPE.LAND,
    label: { singular: $localize`:@@Land:Land` },
  },
  {
    icon: REAL_ESTATE_ICON.BOX_ROOM,
    type: REAL_STATE_TYPE.BOX_ROOM,
    label: { singular: $localize`:@@BoxRoom:Box Room` },
  },
  {
    icon: REAL_ESTATE_ICON.NEW_BUILD,
    type: REAL_STATE_TYPE.NEW_BUILD,
    label: { singular: $localize`:@@NewBuild:New build` },
  },
  {
    icon: REAL_ESTATE_ICON.GOOD_CONDITION,
    type: REAL_STATE_TYPE.GOOD_CONDITION,
    label: { singular: $localize`:@@GoodCondition:Good condition` },
  },
  {
    icon: REAL_ESTATE_ICON.TO_REFORM,
    type: REAL_STATE_TYPE.TO_REFORM,
    label: { singular: $localize`:@@ForRefurbishment:For refurbishment` },
  },
];

export const REAL_ESTATE_TYPE_SPECIFICATION: ItemSpecification[] = [
  ...REAL_ESTATE_NUMERIC_SPECIFICATION,
  ...REAL_ESTATE_ICON_SPEC_TRANSLATION,
];