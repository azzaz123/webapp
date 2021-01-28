import { ItemSpecification } from '@public/core/constants/item-specifications-constants';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { CAR_ICON } from './icons-car-constants';

export const CAR_ICON_SPEC_TRANSLATION: ItemSpecification[] = [
  {
    icon: CAR_ICON.COUPE,
    label: {
      singular: $localize`:@@Coupe:Coupe`,
    },
    type: CAR_SPECIFICATION_TYPE.COUPE,
  },
  {
    icon: CAR_ICON.FAMILY,
    label: {
      singular: $localize`:@@Family:Family`,
    },
    type: CAR_SPECIFICATION_TYPE.FAMILY,
  },
  {
    icon: CAR_ICON.MINI_VAN,
    label: {
      singular: $localize`:@@MiniVan:Mini van`,
    },
    type: CAR_SPECIFICATION_TYPE.MINI_VAN,
  },
  {
    icon: CAR_ICON.FXF,
    label: {
      singular: '4X4',
    },
    type: CAR_SPECIFICATION_TYPE.FXF,
  },
  {
    icon: CAR_ICON.SMALL,
    label: {
      singular: $localize`:@@Small:Small`,
    },
    type: CAR_SPECIFICATION_TYPE.SMALL,
  },
  {
    icon: CAR_ICON.VAN,
    label: {
      singular: $localize`:@@Van:Van`,
    },
    type: CAR_SPECIFICATION_TYPE.VAN,
  },
  {
    icon: CAR_ICON.SEDAN,
    label: {
      singular: $localize`:@@Sedan:Sedan`,
    },
    type: CAR_SPECIFICATION_TYPE.SEDAN,
  },
  {
    icon: CAR_ICON.OTHERS,
    label: {
      singular: $localize`:@@Others:Others`,
    },
    type: CAR_SPECIFICATION_TYPE.OTHERS,
  },
  {
    icon: CAR_ICON.ELECTRIC,
    label: {
      singular: $localize`:@@Electric:Electric`,
    },
    type: CAR_SPECIFICATION_TYPE.ELECTRIC,
  },
  {
    icon: CAR_ICON.GASOIL,
    label: {
      singular: $localize`:@@Gasoil:Gasoil`,
    },
    type: CAR_SPECIFICATION_TYPE.GASOIL,
  },
  {
    icon: CAR_ICON.GASOLINE,
    label: {
      singular: $localize`:@@Gasoline:Gasoline`,
    },
    type: CAR_SPECIFICATION_TYPE.GASOLINE,
  },
  {
    icon: CAR_ICON.AUTOMATIC,
    label: {
      singular: $localize`:@@Automatic:Automatic`,
    },
    type: CAR_SPECIFICATION_TYPE.AUTOMATIC,
  },
  {
    icon: CAR_ICON.MANUAL,
    label: {
      singular: $localize`:@@Manual:Manual`,
    },
    type: CAR_SPECIFICATION_TYPE.MANUAL,
  },
  {
    icon: CAR_ICON.BRAND_NEW,
    label: {
      singular: $localize`:@@New:Brand New`,
    },
    type: CAR_SPECIFICATION_TYPE.CONDITION_0,
  },
  {
    icon: CAR_ICON.MINT,
    label: {
      singular: $localize`:@@CarMint:Mint`,
    },
    type: CAR_SPECIFICATION_TYPE.CONDITION_1,
  },
  {
    icon: CAR_ICON.SOME_BLOW,
    label: {
      singular: $localize`:@@CarUsed:Used`,
    },
    type: CAR_SPECIFICATION_TYPE.CONDITION_2,
  },
  {
    icon: CAR_ICON.CRAPPY,
    label: {
      singular: $localize`:@@Crappy:Crappy`,
    },
    type: CAR_SPECIFICATION_TYPE.CONDITION_3,
  },
];

export const CAR_ICON_SPEC: ItemSpecification[] = [
  {
    icon: CAR_ICON.SEATS,
    type: CAR_SPECIFICATION_TYPE.SEATS,
  },
  {
    icon: CAR_ICON.TWO_DOORS,
    type: CAR_SPECIFICATION_TYPE.TWO_DOORS,
  },
  {
    icon: CAR_ICON.THREE_DOORS,
    type: CAR_SPECIFICATION_TYPE.THREE_DOORS,
  },
  {
    icon: CAR_ICON.FOUR_DOORS,
    type: CAR_SPECIFICATION_TYPE.FOUR_DOORS,
  },
  {
    icon: CAR_ICON.FIVE_DOORS,
    type: CAR_SPECIFICATION_TYPE.FIVE_DOORS,
  },
  {
    icon: CAR_ICON.HORSEPOWER,
    type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
  },
];
export const CAR_TYPE_SPECIFICATION: ItemSpecification[] = [
  ...CAR_ICON_SPEC_TRANSLATION,
  ...CAR_ICON_SPEC,
];
