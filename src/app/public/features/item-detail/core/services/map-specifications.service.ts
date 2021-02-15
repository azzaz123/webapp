import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import {
  CarBodyType,
  CarCondition,
  CarEngine,
  CarGearBox,
  CarSpecifications,
  CounterSpecifications,
  RealestateCondition,
  RealestateOperation,
  RealestateSpecifications,
  RealestateType,
} from '../../components/item-specifications/interfaces/item.specifications.interface';

@Injectable({
  providedIn: 'root',
})
export class MapSpecificationsService {
  public mapCarSpecifications(car: Car): CounterSpecifications[] {
    const carSpecifications = this.getCarSpecifications(car);
    const carCounterSpecifications = this.getCarCounterSpecifications(carSpecifications);
    if (carSpecifications.bodyType === 'others') carCounterSpecifications.shift();
    return carCounterSpecifications.filter((val) => val.type !== null && val.type !== undefined && val.label !== 'EMPTY');
  }

  public mapRealestateSpecifications(realestate: Realestate): CounterSpecifications[] {
    const realestateSpecificationsProperties = this.getRealestateSpecifications(realestate);
    return;
  }

  private getCarSpecifications(car: Car): CarSpecifications {
    return {
      bodyType: car.bodyType as CarBodyType,
      seats: car.numSeats,
      numDoors: car.numDoors,
      carEngine: car.engine as CarEngine,
      horsePower: car.horsepower,
      gearbox: car.gearbox as CarGearBox,
      condition: car.condition as CarCondition,
    };
  }

  private getRealestateSpecifications(realestate: Realestate): RealestateSpecifications {
    return {
      bathrooms: realestate.bathrooms,
      condition: realestate.condition as RealestateCondition,
      elevator: realestate.elevator,
      garage: realestate.garage,
      garden: realestate.garden,
      pool: realestate.pool,
      rooms: realestate.rooms,
      surface: realestate.surface,
      terrace: realestate.terrace,
      type: realestate.type as RealestateType,
      operation: realestate.operation as RealestateOperation,
    };
  }

  private getCarCounterSpecifications(carSpecifications: CarSpecifications): CounterSpecifications[] {
    return [
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
    ];
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
