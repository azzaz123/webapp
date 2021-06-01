import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemExtraInfo } from '@core/item/item-response.interface';
import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Size } from '@public/shared/services/filter-option/interfaces/option-responses/fashion-size-n-gender.interface';
import { getTranslatedItemCondition } from '@core/item/item-condition';
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

    const specificationKeys = this.getSpecificationKeys(item);
    specificationKeys.forEach((key) => {
      const isMappable = this.isSpecificationMappable(objectToCheck, key);
      if (isMappable) {
        const newSpecification = this.defineSpecification(key, objectToCheck[key]);
        specifications.push(newSpecification);
      }
    });

    return specifications;
  }

  private getSpecificationKeys(item: Item | Car): string[] {
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
      return getTranslatedItemCondition(value);
    }
    if (key === '_km') {
      return value + 'Km';
    }

    return value.toString();
  }

  private isSpecificationMappable(objectToSearch: ItemExtraInfo | Car, key: string): boolean {
    const isObjectDefined = !!objectToSearch;
    const isFound = this.isSpecificationFound(objectToSearch, key);
    const isDefined = this.isSpecificationDefined(objectToSearch[key]);
    return isObjectDefined && isFound && isDefined;
  }

  private isSpecificationFound(objectToSearch: ItemExtraInfo | Car, key: string): boolean {
    return !!Object.keys(objectToSearch).find((itemKey) => itemKey === key);
  }

  private isSpecificationDefined(specification: string | Size): boolean {
    const label = this.typeCheckService.isSize(specification) ? specification.text : specification;
    return label !== null && label !== undefined && label !== '';
  }
}
