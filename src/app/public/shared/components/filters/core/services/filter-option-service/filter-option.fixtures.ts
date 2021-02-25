import { IconOption } from './option-responses/icon-option.interface';
import { FilterOption } from '../../interfaces/filter-option.interface';
import { ObjectType } from './option-responses/object-type.interface';
import { BrandModel } from './option-responses/brand-model.interface';
import { SizeNGenderResponse } from './option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from './option-responses/fashion-brand.interface';

export const iconOption: IconOption = {
  icon_id: 'icon',
  id: 'id',
  text: 'text',
};

export const formattedIconOption: FilterOption = {
  label: iconOption.text,
  icon: iconOption.icon_id.concat('.svg'),
  value: iconOption.id,
};

export const objectType: ObjectType = {
  id: 'id',
  name: 'name',
  excluded_fields: [],
  children: [
    {
      id: 'child',
      name: 'child_name',
    },
  ],
  has_children: true,
  hierarchy: [],
};

export const formattedObjectType: FilterOption = {
  value: objectType.id,
  hasChildren: objectType.has_children,
  label: objectType.name,
};

export const brandNModel: BrandModel = {
  brand: 'brand',
  model: 'model',
};

export const formattedPhoneBrandNModel: FilterOption = {
  value: calcPhoneBrandModelValue(brandNModel),
  label: calcBrandModelLabel(brandNModel),
};

export const formattedCarBrandNModel: FilterOption = {
  value: (brandNModel as unknown) as Record<string, string>,
  label: calcBrandModelLabel(brandNModel),
};

export const fashionBrand: FashionBrand = {
  brand: 'brand',
  is_popular: true,
};

export const formattedFashionBrand: FilterOption = {
  label: fashionBrand.brand,
  value: fashionBrand.brand,
};

export const sizeNGender: SizeNGenderResponse = {
  male: [
    {
      id: 1,
      text: 'male',
    },
  ],
  female: [
    {
      id: 1,
      text: 'female',
    },
  ],
};

export const formattedMaleSize: FilterOption = {
  value: sizeNGender.male[0].id.toString(),
  label: sizeNGender.male[0].text,
};

export const formattedFemaleSize: FilterOption = {
  value: sizeNGender.female[0].id.toString(),
  label: sizeNGender.female[0].text,
};

function calcBrandModelLabel(brandModel: BrandModel): string {
  let label = brandModel.brand;

  if (brandModel.model) {
    label = label.concat(', ', brandModel.model);
  }

  return label;
}

function calcPhoneBrandModelValue(brandModel: BrandModel): string {
  let value = brandModel.brand;

  if (brandModel.model) {
    value = value.concat('|', brandModel.model);
  }

  return value;
}
