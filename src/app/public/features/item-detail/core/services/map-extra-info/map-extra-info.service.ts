import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemExtraInfo } from '@core/item/item-response.interface';
import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';

export type ItemCondition = 'un_opened' | 'un_worn' | 'in_box' | 'new' | 'as_good_as_new' | 'good' | 'fair' | 'has_given_it_all';
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
    let specifications = [];

    this.specificationKeys(item).forEach((key) => {
      if (this.specificationExistsAndDefined(objectToCheck, key)) {
        specifications.push(this.defineSpecification(key, objectToCheck[key]));
      }
    });

    return this.capitalizeLabels(specifications);
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
      return this.translateCondition(value);
    }
    if (key === '_km') {
      return value + 'Km';
    }

    return value.toString();
  }

  private specificationExistsAndDefined(objectToSearch: ItemExtraInfo | Car, key: string): boolean {
    return Object.keys(objectToSearch).find((itemKey) => itemKey === key) && this.specificationIsDefined(objectToSearch[key]);
  }

  private specificationIsDefined(specification: string): boolean {
    return specification !== null && specification !== undefined && specification !== '';
  }

  private translateCondition(condition: ItemCondition): string {
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
    }
  }

  private capitalizeLabels(labels: string[]): string[] {
    return labels.map((label) => label.charAt(0).toUpperCase() + label.substr(1));
  }
}
