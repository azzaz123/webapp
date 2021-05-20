import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemExtraInfo } from '@core/item/item-response.interface';
import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Size } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-size-n-gender.interface';
import { ItemCondition } from '@core/item/item-condition';
import { capitalizeString } from '@core/helpers/capitalize-string/capitalize-string';

@Injectable({
  providedIn: 'root',
})
export class MapExtraInfoService {
  private phoneSpecifications = ['brand', 'model', 'condition'];
  private fashionSpecifications = ['size'].concat(this.phoneSpecifications);
  private carSpecifications = ['_version', '_year', '_km'];
  private genericSpecifications = ['condition'];

  constructor(private typeCheckService: TypeCheckService) {}

  public mapExtraInfo(item: Item | Car): string[] {
    const objectToCheck = this.typeCheckService.isCar(item) ? item : item.extraInfo;
    const specifications = this.generateSpecifications(item, objectToCheck);
    const capitalizedSpecifications = specifications.map((spec) => capitalizeString(spec));
    return capitalizedSpecifications;
  }

  private generateSpecifications(item: Item | Car, objectToCheck: ItemExtraInfo | Car): string[] {
    const specifications = [];

    if (!objectToCheck) {
      return specifications;
    }

    this.specificationKeys(item).forEach((key) => {
      if (this.specificationExistsAndDefined(objectToCheck, key)) {
        specifications.push(this.defineSpecification(key, objectToCheck[key]));
      }
    });

    return specifications;
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
    return this.genericSpecifications;
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
    return (
      !!objectToSearch && Object.keys(objectToSearch).find((itemKey) => itemKey === key) && this.isSpecificationDefined(objectToSearch[key])
    );
  }

  private isSpecificationDefined(specification: string | Size): boolean {
    const label = this.typeCheckService.isSize(specification) ? specification.text : specification;
    return label !== null && label !== undefined && label !== '';
  }

  private getTranslatedCondition(condition: ItemCondition): string {
    switch (condition) {
      case 'un_opened':
        return $localize`:@@web_condition_un_opened:Unopened`;
      case 'un_worn':
        return $localize`:@@web_condition_unworn:Unworn`;
      case 'in_box':
        return $localize`:@@web_condition_in_box:In its box`;
      case 'new':
        return $localize`:@@web_new:New`;
      case 'as_good_as_new':
        return $localize`:@@web_condition_as_good_as_new:As good as new`;
      case 'good':
        return $localize`:@@web_good_condition:Good condition`;
      case 'fair':
        return $localize`:@@web_condition_fair:Fair condition`;
      case 'has_given_it_all':
        return $localize`:@@web_condition_has_given_it_all:May have to be repaired`;
      default:
        return $localize`:@@web_undefined:Undefined`;
    }
  }
}
