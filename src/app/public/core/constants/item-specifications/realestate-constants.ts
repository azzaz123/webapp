import {
  ICON_SPECIFICATION,
  NUMERIC_SPECIFICATION,
} from '../item-specifications-constants';

export enum REAL_STATE_TYPE {
  GARAGE = 'garage',
  ELEVATOR = 'elevator',
  GARDEN = 'garden',
  POOL = 'pool',
  TERRACE = 'terrace',
  BATHROOMS = 'bathrooms',
  ROOMS = 'rooms',
  SURFACE = 'surface',
}

export enum REAL_ESTATE_ICON {
  GARAGE = '/assets/icons/garage.svg',
  ELEVATOR = '/assets/icons/elevator.svg',
  GARDEN = '/assets/icons/garden.svg',
  POOL = '/assets/icons/pool.svg',
  TERRACE = '/assets/icons/terrace.svg',
}

export const REAL_ESTATE_ICON_SPECIFICATION: ICON_SPECIFICATION[] = [
  {
    icon: REAL_ESTATE_ICON.GARAGE,
    label: $localize`:@@Garage:Garage`,
    type: REAL_STATE_TYPE.GARAGE,
  },
  {
    icon: REAL_ESTATE_ICON.ELEVATOR,
    label: $localize`:@@Elevator:Elevator`,
    type: REAL_STATE_TYPE.ELEVATOR,
  },
  {
    icon: REAL_ESTATE_ICON.GARDEN,
    label: $localize`:@@Garden:Garden`,
    type: REAL_STATE_TYPE.GARDEN,
  },
  {
    icon: REAL_ESTATE_ICON.POOL,
    label: $localize`:@@Pool:Pool`,
    type: REAL_STATE_TYPE.POOL,
  },
];

export const REAL_ESTATE_NUMERIC_SPECIFICATION: NUMERIC_SPECIFICATION[] = [
  {
    type: REAL_STATE_TYPE.BATHROOMS,
    translations: {
      singular: $localize`:@@Bathroom:Bathroom`,
      plural: $localize`:@@Bathrooms:Bathrooms`,
    },
  },
  {
    type: REAL_STATE_TYPE.ROOMS,
    translations: {
      singular: $localize`:@@Room:Room`,
      plural: $localize`:@@Rooms:Rooms`,
    },
  },
  {
    type: REAL_STATE_TYPE.SURFACE,
    label: 'm2',
  },
];

// Trae las conditions => new build, good condition or for refrubishment
// this.realestateKeysService
// .getConditions()
// .subscribe((conditions: IOption[]) => {
//   console.log('conditions => ', conditions);
//   this.conditions = conditions;
// });

// Flat, house, room, office, garage, land or box room
// this.realestateKeysService.getTypes(operation).subscribe((types: Key[]) => {
//     this.types = types;
//   });
