import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemExtraInfo } from '@core/item/item-response.interface';
import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Size } from '@public/shared/components/filters/core/services/filter-option-service/option-responses/fashion-size-n-gender.interface';
import { ItemConditions } from '@core/item/item-conditions';

@Injectable({
  providedIn: 'root',
})
export class MapExtraInfoService {
  constructor(private typeCheckService: TypeCheckService) {}
  private phoneSpecifications = ['brand', 'model', 'condition'];
  private fashionSpecifications = ['size'].concat(this.phoneSpecifications);
  private carSpecifications = ['_version', '_year', '_km'];

  public mapExtraInfo(item: Item | Car): string[] {
    const objectToCheck = this.typeCheckService.isCar(item) ? item : item.extraInfo;
    const specifications = [];

    this.specificationKeys(item).forEach((key) => {
      if (this.specificationExistsAndDefined(objectToCheck, key)) {
        specifications.push(this.defineSpecification(key, objectToCheck[key]));
      }
    });

    return this.getCapitalizedLabels(specifications);
  }

  private specificationKeys(item: Item | Car): string[] {
    if (this.typeCheckService.isFashion(item)) {
      return this.fashionSpecifications;
    }
    if (this.typeCheckService.isCellPhoneAccessories(item)) {
      return this.phoneSpecifications;
    }
    if (this.typeCheckService.isCar(item)) {
      return this.carSpecifications;
    }
  }

  private defineSpecification(key: string, value: any): string {
    if (key === 'size') {
      return value?.text;
    }
    if (key === 'condition') {
      return this.getTranslatedCondition(value);
    }
    if (key === '_km') {
      return value + 'Km';
    }

    return value.toString();
  }

  private specificationExistsAndDefined(objectToSearch: ItemExtraInfo | Car, key: string): boolean {
    return Object.keys(objectToSearch).find((itemKey) => itemKey === key) && this.isSpecificationDefined(objectToSearch[key]);
  }

  private isSpecificationDefined(specification: string | Size): boolean {
    const label = this.typeCheckService.isSize(specification) ? specification.text : specification;
    return label !== null && label !== undefined && label !== '';
  }

  private getTranslatedCondition(condition: ItemConditions): string {
    switch (condition) {
      case 'un_opened':
        return $localize`:@@Condition_UnOpened:Unopened`;
      case 'un_worn':
        return $localize`:@@Condition_Unworn:Unworn`;
      case 'in_box':
        return $localize`:@@Condition_InBox:In its box`;
      case 'new':
        return $localize`:@@New:New`;
      case 'as_good_as_new':
        return $localize`:@@Condition_AsGoodAsNew:As good as new`;
      case 'good':
        return $localize`:@@GoodCondition:Good condition`;
      case 'fair':
        return $localize`:@@Condition_Fair:Fair condition`;
      case 'has_given_it_all':
        return $localize`:@@Condition_HasGivenItAll:May have to be repaired`;
      default:
        return $localize`:@@Undefined:Undefined`;
    }
  }

  private getCapitalizedLabels(labels: string[]): string[] {
    return labels.map((label) => label.charAt(0).toUpperCase() + label.substr(1));
  }
}
