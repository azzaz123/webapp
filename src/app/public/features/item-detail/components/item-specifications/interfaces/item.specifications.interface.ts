import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';

export interface CounterSpecifications {
  type?: REAL_ESTATE_SPECIFICATION_TYPE | CAR_SPECIFICATION_TYPE;
  counter?: string | number;
  label?: string;
}

export interface CarSpecifications {
  bodyType: CarBodyType;
  seats: number;
  numDoors: number;
  carEngine: CarEngine;
  horsePower: number;
  gearbox: CarGearBox;
}

export type CarBodyType = 'small_car' | 'coupe_cabrio' | 'sedan' | 'family_car' | 'mini_van' | '4X4' | 'van' | 'others';
export type CarEngine = 'gasoil' | 'gasoline' | 'electric-hybrid' | 'others';
export type CarGearBox = 'manual' | 'automatic';
export type CarCondition = 'brand_new' | 'mint' | 'some_blow' | 'crappy';

export interface RealestateSpecifications {
  bathrooms: number;
  condition: RealestateCondition;
  elevator: boolean;
  garage: boolean;
  garden: boolean;
  pool: boolean;
  rooms: number;
  surface: number;
  terrace: boolean;
  type: RealestateType;
  operation: RealestateOperation;
}

export type RealestateType = 'apartment' | 'room' | 'office' | 'garage' | 'land' | 'box_room' | 'house';
export type RealestateCondition = 'new_construction' | 'mint' | 'to_reform';
export type RealestateOperation = 'buy' | 'rent';
