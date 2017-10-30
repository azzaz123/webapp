import * as _ from 'lodash';
import { IOption } from 'ng-select';

export const CAR_BODY_TYPES_RESPONSE: any = [{
  'id': 'small_car',
  'icon_id': 'small_car',
  'text': 'Small'
}, {
  'id': 'coupe_cabrio',
  'icon_id': 'coupe_cabrio',
  'text': 'Coupe'
}, {
  'id': 'sedan',
  'icon_id': 'sedan',
  'text': 'Sedan'
}, {
  'id': 'family_car',
  'icon_id': 'family_car',
  'text': 'Family'
}, {
  'id': 'mini_van',
  'icon_id': 'mini_van',
  'text': 'Mini Van'
}, {
  'id': '4X4',
  'icon_id': '4X4',
  'text': '4X4'
}, {
  'id': 'van',
  'icon_id': 'van',
  'text': 'Van'
}, {
  'id': 'others',
  'icon_id': 'others',
  'text': 'Others'
}];

export const CAR_BODY_TYPES: any = [{
  'value': 'small_car',
  'label': 'Small'
}, {
  'value': 'coupe_cabrio',
  'label': 'Coupe'
}, {
  'value': 'sedan',
  'label': 'Sedan'
}, {
  'value': 'family_car',
  'label': 'Family'
}, {
  'value': 'mini_van',
  'label': 'Mini Van'
}, {
  'value': '4X4',
  'label': '4X4'
}, {
  'value': 'van',
  'label': 'Van'
}, {
  'value': 'others',
  'label': 'Others'
}];

export const CAR_BRANDS_RESPONSE: string[] = ['Abarth', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'BYD', 'Cadillac', 'Caterham', 'Chevrolet', 'Chrysler', 'Citroen', 'Corvette', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS', 'Faam', 'Ferrari', 'Fiat', 'Ford', 'Fornasari', 'Galloper', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'KIA', 'KTM', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'LDV', 'Lexus', 'Lotus', 'Mahindra', 'Maserati', 'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Morgan', 'Nissan', 'Opel', 'Peugeot', 'Piaggio', 'Porsche', 'Renault', 'Renault Trucks', 'Rolls-Royce', 'Rover', 'Saab', 'Santana', 'SEAT', 'Skoda', 'smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tata', 'Tesla', 'TH!NK', 'Toyota', 'VAZ', 'Volkswagen', 'Volvo', 'Wiesmann'];
export const CAR_BRANDS: IOption[] = toSelectOptions(CAR_BRANDS_RESPONSE);

export const CAR_YEARS_RESPONSE: number[] = [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008];
export const CAR_YEARS: IOption[] = toSelectOptions(CAR_YEARS_RESPONSE);

export const CAR_MODELS_RESPONSE: string[] = ['124 Spider', '500', '695 Biposto'];
export const CAR_MODELS: IOption[] = toSelectOptions(CAR_MODELS_RESPONSE);

export const CAR_VERSIONS_RESPONSE: string[] = ['1.4 MultiAir 170 2p', '1.4 MultiAir 170 2p Aut.'];
export const CAR_VERSIONS: IOption[] = toSelectOptions(CAR_VERSIONS_RESPONSE);

function toSelectOptions(values: any[]): IOption[] {
  return _.map(values, (label: any) => ({
    value: label,
    label: label
  }));
}
