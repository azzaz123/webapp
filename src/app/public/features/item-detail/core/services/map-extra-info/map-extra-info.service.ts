import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';

@Injectable({
  providedIn: 'root',
})
export class MapExtraInfoService {
  constructor(private typeCheckService: TypeCheckService) {}
  private phoneSpecifications = ['brand', 'model', 'condition'];
  private fashionSpecifications = ['size'].concat(this.phoneSpecifications);
  private carSpecifications = ['brand', 'model', 'year', 'km'];

  public mapCarExtraInfo(car: Car): string[] {
    return;
  }

  public mapConsumerGoodExtraInfo(item: Item): string[] {
    let specifications = [];

    this.specificationKeys(item).forEach((key) => {
      if (this.specificationExistsAndDefined(item, key)) {
        const specification = this.defineSpecification(key, item.extraInfo[key]);
        specifications.push(specification);
      }
    });

    return this.capitalizeLabels(specifications);
  }

  private specificationKeys(item: Item): string[] {
    if (this.typeCheckService.isFashion(item)) {
      return this.fashionSpecifications;
    }
    if (this.typeCheckService.isCellPhoneAccessories(item)) {
      return this.phoneSpecifications;
    }
  }

  private defineSpecification(key: string, value: any): string {
    if (key === 'size') {
      return value?.text;
    }
    return value;
  }

  private specificationExistsAndDefined(item: Item, key: string): boolean {
    return Object.keys(item.extraInfo).find((itemKey) => itemKey === key) && this.specificationIsDefined(item.extraInfo[key]);
  }

  private specificationIsDefined(specification): boolean {
    return specification !== null && specification !== undefined && specification !== '';
  }

  private capitalizeLabels(labels: string[]): string[] {
    return labels.map((label) => label.charAt(0).toUpperCase() + label.substr(1));
  }
}
