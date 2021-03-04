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
  private fashionSpecifications = this.phoneSpecifications.concat(['size']);
  private carSpecifications = ['brand', 'model', 'year', 'km'];

  public mapCarExtraInfo(car: Car): string[] {
    return;
  }

  public mapConsumerGoodExtraInfo(item: Item): string[] {
    let specifications = [];
    Object.entries(item.extraInfo).forEach(([key, value]) => {
      const specification = this.defineSpecification(this.defineSpecificationKeys(item), key, value);
      if (this.specificationIsNotEmpty(specification)) {
        specifications.push(specification);
      }
    });

    return specifications;
  }

  private defineSpecificationKeys(item: Item): string[] {
    if (this.typeCheckService.isFashion(item)) {
      return this.fashionSpecifications;
    }
    if (this.typeCheckService.isCellPhoneAccessories(item)) {
      return this.phoneSpecifications;
    }
  }

  private defineSpecification(keySpecifications: string[], key: string, value: any): string {
    if (keySpecifications.includes(key)) {
      if (key === 'size') {
        return value?.text;
      }
      return value;
    }
  }

  private specificationIsNotEmpty(specification): boolean {
    return specification !== null && specification !== undefined && specification !== '';
  }
}
