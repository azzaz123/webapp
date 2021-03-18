import { IconOption } from '@public/shared/services/filter-option/interfaces/option-responses/icon-option.interface';
import { FilterOption } from '@public/shared/components/filters/core/interfaces/filter-option.interface';
import { ObjectType } from '@public/shared/services/filter-option/interfaces/option-responses/object-type.interface';
import { BrandModel } from '@public/shared/services/filter-option/interfaces/option-responses/brand-model.interface';
import { SizeNGenderResponse } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-brand.interface';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options.interface';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

export class MockFilterOptionApiService {
  public getApiOptions(method: string, params: QueryParams, paginationOptions: PaginationOptions): Observable<unknown> {
    return this[method](params, paginationOptions);
  }

  public apiMethod(): Observable<unknown> {
    return of({});
  }
}

export class MockFilterOptionMapperService {
  public formatApiResponse(method: string, response: unknown, params: QueryParams): FilterOption[] {
    return this[method](response, params);
  }

  public mapperMethod(): void {}
}

export class MockFilterParameterDraftService implements Partial<FilterParameterDraftService> {
  public getParametersByKey(keys: string[]): FilterParameter[] {
    return keys.map((key) => ({
      key,
      value: key,
    }));
  }
}

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
