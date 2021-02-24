import { Injectable } from '@angular/core';
import { FilterOption } from '../../interfaces/filter-option.interface';
import { ConditionResponse } from './option-responses/condition.interface';
import { IconOption } from './option-responses/icon-option.interface';
import { ObjectType } from './option-responses/object-type.interface';
import { BrandModel } from './option-responses/brand-model.interface';
import { SizeNGenderResponse } from '@public/shared/components/filters/core/services/filter-option-service/option-responses/fashion-size-n-gender.interface';
import { FashionBrand } from '@public/shared/components/filters/core/services/filter-option-service/option-responses/fashion-brand.interface';
import { SIZE_GENDER } from '@public/shared/components/filters/core/enums/size-gender.enum';

@Injectable()
export class FilterOptionsMapperService {
  public formatConditionResponse(conditionResponse: ConditionResponse): FilterOption[] {
    return this.formatIconOptions(conditionResponse.conditions);
  }

  public formatObjectType(objectTypes: ObjectType[]): FilterOption[] {
    return objectTypes.map((objectType) => ({
      value: objectType.id,
      label: objectType.name,
      hasChildren: objectType.has_children,
    }));
  }

  public formatPhonesBrandModel(brandModels: BrandModel[]): FilterOption[] {
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

  public formatCarsBrandModel(brandModels: BrandModel[]): FilterOption[] {
    return brandModels.map((brandModel) => ({
      value: (brandModel as unknown) as Record<string, string>,
      label: this.getBrandModelLabel(brandModel),
    }));
  }

  public formatIconOptions(iconOptions: IconOption[]): FilterOption[] {
    return iconOptions.map((condition) => ({
      value: condition.id,
      label: condition.text,
      // TODO: We need to add assets, and update path if needed
      icon: `${condition.icon_id}.svg`,
    }));
  }

  public formatSizeNGender(sizeNGender: SizeNGenderResponse, gender: SIZE_GENDER): FilterOption[] {
    return sizeNGender[gender].map((size) => ({
      value: size.id.toString(),
      label: size.text,
    }));
  }

  // TODO: We need to set something up for isPopular cases
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