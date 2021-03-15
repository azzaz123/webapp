import { Injectable } from '@angular/core';
import { FilterOption } from '../../../components/filters/core/interfaces/filter-option.interface';
import { ConditionResponse } from '../interfaces/option-responses/condition.interface';
import { IconOption } from '../interfaces/option-responses/icon-option.interface';
import { ObjectType } from '../interfaces/option-responses/object-type.interface';
import { BrandModel } from '../interfaces/option-responses/brand-model.interface';
import { SizeNGenderResponse } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-brand.interface';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params.interface';

export type FilterOptionsMapperMethods = keyof Omit<FilterOptionsMapperService, 'formatApiResponse'>;

@Injectable()
export class FilterOptionsMapperService {
  public formatApiResponse(method: FilterOptionsMapperMethods, response: unknown, params: QueryParams): FilterOption[] {
    return this[method](response, params);
  }

  public formatConditionResponse(conditionResponse: ConditionResponse): FilterOption[];
  public formatConditionResponse(response: unknown, params: QueryParams): FilterOption[];
  public formatConditionResponse(conditionResponse: ConditionResponse): FilterOption[] {
    return this.formatIconOptions(conditionResponse.conditions);
  }

  public formatObjectType(objectTypes: ObjectType[]): FilterOption[];
  public formatObjectType(response: unknown, params: QueryParams): FilterOption[];
  public formatObjectType(objectTypes: ObjectType[]): FilterOption[] {
    return objectTypes.map((objectType) => ({
      value: objectType.id,
      label: objectType.name,
      hasChildren: objectType.has_children,
    }));
  }

  public formatBrandModel(brandModels: BrandModel[]): FilterOption[];
  public formatBrandModel(response: unknown, params: QueryParams): FilterOption[];
  public formatBrandModel(brandModels: BrandModel[]): FilterOption[] {
    return brandModels.map((brandModel) => {
      let value = brandModel.brand;

      if (brandModel.model) {
        value = value.concat('|', brandModel.model);
      }
      return {
        value,
        label: this.getBrandModelLabel(brandModel),
      };
    });
  }

  public formatCarsBrandModel(brandModels: BrandModel[]): FilterOption[];
  public formatCarsBrandModel(response: unknown, params: QueryParams): FilterOption[];
  public formatCarsBrandModel(brandModels: BrandModel[]): FilterOption[] {
    return brandModels.map((brandModel) => ({
      value: (brandModel as unknown) as Record<string, string>,
      label: this.getBrandModelLabel(brandModel),
    }));
  }

  public formatIconOptions(iconOptions: IconOption[]): FilterOption[];
  public formatIconOptions(response: unknown, params: QueryParams): FilterOption[];
  public formatIconOptions(iconOptions: IconOption[]): FilterOption[] {
    return iconOptions.map((condition) => ({
      value: condition.id,
      label: condition.text,
      // TODO: We need to add assets, and update path if needed
      icon: `${condition.icon_id}.svg`,
    }));
  }

  public formatSizeNGender(sizeNGender: SizeNGenderResponse, params: QueryParams<'gender'>): FilterOption[];
  public formatSizeNGender(response: unknown, params: QueryParams): FilterOption[];
  public formatSizeNGender(sizeNGender: SizeNGenderResponse, params: QueryParams<'gender'>): FilterOption[] {
    return sizeNGender[params.gender].map((size) => ({
      value: size.id.toString(),
      label: size.text,
    }));
  }

  // TODO: We need to set something up for isPopular cases
  public formatFashionBrand(brands: FashionBrand[]): FilterOption[];
  public formatFashionBrand(response: unknown, params: QueryParams): FilterOption[];
  public formatFashionBrand(brands: FashionBrand[]): FilterOption[] {
    return brands.map((brand) => ({
      value: brand.brand,
      label: brand.brand,
    }));
  }

  private getBrandModelLabel(brandModel: BrandModel): string {
    let label = brandModel.brand;

    if (brandModel.model) {
      label = label.concat(', ', brandModel.model);
    }

    return label;
  }
}
