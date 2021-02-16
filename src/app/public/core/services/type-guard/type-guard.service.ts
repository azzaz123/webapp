import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';

@Injectable({
  providedIn: 'root',
})
export class TypeGuardService {
  public isNumber(label: unknown): label is number {
    return typeof label === 'number';
  }

  public isBoolean(label: unknown): label is boolean {
    return typeof label === 'boolean';
  }

  public isCar(item: unknown): item is Car {
    return item instanceof Car;
  }

  public isRealEstate(item: unknown): item is Realestate {
    return item instanceof Realestate;
  }
}
