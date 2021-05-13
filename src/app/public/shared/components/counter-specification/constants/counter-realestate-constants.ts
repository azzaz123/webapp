import { ItemSpecification } from '@public/core/constants/item-specifications-constants';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { REAL_ESTATE_ICON } from './icons-realestate-constants';

export const REAL_ESTATE_NUMERIC_SPECIFICATION: ItemSpecification[] = [
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.BATHROOMS,
    label: {
      singular: $localize`:@@web_bathroom:Bathroom`,
      plural: $localize`:@@web_bathrooms:Bathrooms`,
    },
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.ROOMS,
    label: {
      singular: $localize`:@@web_room:Room`,
      plural: $localize`:@@web_rooms:Rooms`,
    },
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.SURFACE,
    label: { singular: 'm2', plural: 'm2' },
  },
];

export const REAL_ESTATE_ICON_SPEC_TRANSLATION: ItemSpecification[] = [
  {
    icon: REAL_ESTATE_ICON.GARAGE,
    label: { singular: $localize`:@@web_garage:Garage` },
    type: REAL_ESTATE_SPECIFICATION_TYPE.GARAGE,
  },
  {
    icon: REAL_ESTATE_ICON.ELEVATOR,
    label: { singular: $localize`:@@web_elevator:Elevator` },
    type: REAL_ESTATE_SPECIFICATION_TYPE.ELEVATOR,
  },
  {
    icon: REAL_ESTATE_ICON.GARDEN,
    label: { singular: $localize`:@@web_garden:Garden` },
    type: REAL_ESTATE_SPECIFICATION_TYPE.GARDEN,
  },
  {
    icon: REAL_ESTATE_ICON.POOL,
    label: { singular: $localize`:@@web_pool:Pool` },
    type: REAL_ESTATE_SPECIFICATION_TYPE.POOL,
  },
  {
    icon: REAL_ESTATE_ICON.TERRACE,
    label: { singular: $localize`:@@web_terrace:Terrace` },
    type: REAL_ESTATE_SPECIFICATION_TYPE.TERRACE,
  },
  {
    icon: REAL_ESTATE_ICON.ROOM,
    type: REAL_ESTATE_SPECIFICATION_TYPE.ROOM,
    label: { singular: $localize`:@@web_room:Room` },
  },
  {
    icon: REAL_ESTATE_ICON.FLAT,
    type: REAL_ESTATE_SPECIFICATION_TYPE.FLAT,
    label: { singular: $localize`:@@web_flat:Flat` },
  },
  {
    icon: REAL_ESTATE_ICON.HOUSE,
    type: REAL_ESTATE_SPECIFICATION_TYPE.HOUSE,
    label: { singular: $localize`:@@web_house:House` },
  },
  {
    icon: REAL_ESTATE_ICON.OFFICE,
    type: REAL_ESTATE_SPECIFICATION_TYPE.OFFICE,
    label: { singular: $localize`:@@web_office:Premises/Office` },
  },
  {
    icon: REAL_ESTATE_ICON.LAND,
    type: REAL_ESTATE_SPECIFICATION_TYPE.LAND,
    label: { singular: $localize`:@@web_land:Land` },
  },
  {
    icon: REAL_ESTATE_ICON.BOX_ROOM,
    type: REAL_ESTATE_SPECIFICATION_TYPE.BOX_ROOM,
    label: { singular: $localize`:@@web_box_room:Box Room` },
  },
  {
    icon: REAL_ESTATE_ICON.NEW_BUILD,
    type: REAL_ESTATE_SPECIFICATION_TYPE.NEW_BUILD,
    label: { singular: $localize`:@@web_new_build:New build` },
  },
  {
    icon: REAL_ESTATE_ICON.GOOD_CONDITION,
    type: REAL_ESTATE_SPECIFICATION_TYPE.GOOD_CONDITION,
    label: { singular: $localize`:@@GoodCondition:Good condition` },
  },
  {
    icon: REAL_ESTATE_ICON.TO_REFORM,
    type: REAL_ESTATE_SPECIFICATION_TYPE.TO_REFORM,
    label: { singular: $localize`:@@web_for_refurbishment:For refurbishment` },
  },
  {
    icon: REAL_ESTATE_ICON.KEY,
    type: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
    label: { singular: $localize`:@@web_rent:Rent` },
  },
  {
    icon: REAL_ESTATE_ICON.BILLS,
    type: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
    label: { singular: $localize`:@@web_buy:Buy` },
  },
];

export const REAL_ESTATE_TYPE_SPECIFICATION: ItemSpecification[] = [
  ...REAL_ESTATE_NUMERIC_SPECIFICATION,
  ...REAL_ESTATE_ICON_SPEC_TRANSLATION,
];
