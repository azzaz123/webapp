import { Injectable } from '@angular/core';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { CarSpecifications, CounterSpecifications } from '../../components/item-specifications/interfaces/item.specifications.interface';

@Injectable({
  providedIn: 'root',
})
export class MapSpecificationsService {
  public mapCarSpecifications(carSpecifications: CarSpecifications): CounterSpecifications[] {
    const carCounterSpecifications = [
      {
        type: this.getCarSpecificationType(carSpecifications.bodyType),
      },
      {
        type: CAR_SPECIFICATION_TYPE.SEATS,
        label: this.getCarLabel(carSpecifications.seats),
      },
      {
        type: this.getDoorsType(carSpecifications.numDoors),
        label: this.getCarLabel(carSpecifications.numDoors),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.carEngine),
      },
      {
        type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
        label: this.getCarLabel(carSpecifications.horsePower, true),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.gearbox),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.condition),
      },
    ] as CounterSpecifications[];

    if (carSpecifications.bodyType === 'others') carCounterSpecifications.shift();
    return carCounterSpecifications.filter((val) => val.type !== null && val.type !== undefined && val.label !== 'EMPTY');
  }

  private getCarSpecificationType(value: string): CAR_SPECIFICATION_TYPE {
    const keys = Object.keys(CAR_SPECIFICATION_TYPE).filter((key) => CAR_SPECIFICATION_TYPE[key] == value) as CAR_SPECIFICATION_TYPE[];
    const key = keys.length > 0 ? keys[0] : null;

    return CAR_SPECIFICATION_TYPE[key];
  }

  private getCarLabel(label: string | number, isHorsePower = false): string {
    const EMPTY_VALUE = 'EMPTY';
    if (isHorsePower) {
      return label ? `${label} cv` : EMPTY_VALUE;
    } else {
      return label ? label.toString() : EMPTY_VALUE;
    }
  }

  private getDoorsType(doors: number): CAR_SPECIFICATION_TYPE {
    switch (doors) {
      case 2:
        return CAR_SPECIFICATION_TYPE.TWO_DOORS;
      case 3:
        return CAR_SPECIFICATION_TYPE.THREE_DOORS;
      case 4:
        return CAR_SPECIFICATION_TYPE.FOUR_DOORS;
      case 5:
        return CAR_SPECIFICATION_TYPE.FIVE_DOORS;
    }
  }
}
