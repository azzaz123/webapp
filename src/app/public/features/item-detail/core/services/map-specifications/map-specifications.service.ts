import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import {
  CarBodyType,
  CarCondition,
  CarEngine,
  CarGearBox,
  CarSpecifications,
  CounterSpecifications,
  RealestateCondition,
  RealestateSpecifications,
  RealestateType,
} from '../../../components/item-specifications/interfaces/item.specifications.interface';

@Injectable({
  providedIn: 'root',
})
export class MapSpecificationsService {
  private readonly EMPTY_VALUE = 'EMPTY';

  constructor(private typeCheckService: TypeCheckService) {}

  public mapCarSpecifications(car: Car): CounterSpecifications[] {
    const carSpecifications = this.getCarSpecifications(car);
    const carCounters = this.getCarCounters(carSpecifications);
    if (carSpecifications.bodyType === 'others') carCounters.shift();
    return carCounters.filter((counter) => this.counterSpecificationsAreNotEmpty(counter));
  }

  public mapRealestateSpecifications(realestate: Realestate): CounterSpecifications[] {
    const realestateSpecifications = this.getRealestateSpecifications(realestate);
    const realestateCounters = this.getRealestateCounters(realestateSpecifications);
    return realestateCounters.filter((counter) => this.counterSpecificationsAreNotEmpty(counter));
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
    };
  }

  private getCarCounters(carSpecifications: CarSpecifications): CounterSpecifications[] {
    return [
      {
        type: this.getCarSpecificationType(carSpecifications.bodyType),
      },
      {
        type: CAR_SPECIFICATION_TYPE.SEATS,
        label: this.getLabel(carSpecifications.seats),
      },
      {
        type: this.getDoorsType(carSpecifications.numDoors),
        label: this.getLabel(carSpecifications.numDoors),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.carEngine),
      },
      {
        type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
        label: this.getLabel(carSpecifications.horsePower, true),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.gearbox),
      },
      {
        type: this.getCarSpecificationType(carSpecifications.condition),
      },
    ];
  }

  private getRealestateCounters(realestateSpecifications: RealestateSpecifications): CounterSpecifications[] {
    const realestateCounters = [
      {
        type: this.getRealestateSpecificationType(realestateSpecifications.type),
      },
      {
        type: REAL_ESTATE_SPECIFICATION_TYPE.SURFACE,
        counter: this.getCounter(realestateSpecifications.surface),
      },
      {
        type: REAL_ESTATE_SPECIFICATION_TYPE.ROOMS,
        counter: this.getCounter(realestateSpecifications.rooms),
      },
      {
        type: REAL_ESTATE_SPECIFICATION_TYPE.BATHROOMS,
        counter: this.getCounter(realestateSpecifications.bathrooms),
      },
    ];

    const pickedSpecifications = (({ elevator, garage, garden, pool, terrace, condition }) => ({
      condition,
      garage,
      elevator,
      garden,
      pool,
      terrace,
    }))(realestateSpecifications);

    Object.entries(pickedSpecifications).forEach(([key, value]) => {
      if (value) {
        const specificationType = this.typeCheckService.isBoolean(value) ? key : value;
        realestateCounters.push({
          type: this.getRealestateSpecificationType(specificationType),
        });
      }
    });

    return realestateCounters;
  }

  private getCarSpecificationType(value: string): CAR_SPECIFICATION_TYPE {
    const keys = Object.keys(CAR_SPECIFICATION_TYPE).filter((key) => CAR_SPECIFICATION_TYPE[key] == value) as CAR_SPECIFICATION_TYPE[];
    const key = keys.length > 0 ? keys[0] : null;

    return CAR_SPECIFICATION_TYPE[key];
  }

  private getRealestateSpecificationType(value: string): REAL_ESTATE_SPECIFICATION_TYPE {
    const keys = Object.keys(REAL_ESTATE_SPECIFICATION_TYPE).filter(
      (key) => REAL_ESTATE_SPECIFICATION_TYPE[key] == value
    ) as REAL_ESTATE_SPECIFICATION_TYPE[];
    const key = keys.length > 0 ? keys[0] : null;

    return REAL_ESTATE_SPECIFICATION_TYPE[key];
  }

  private getLabel(label: string | number, isHorsePower = false): string {
    if (!label) {
      return this.EMPTY_VALUE;
    }
    return isHorsePower ? `${label} cv` : label.toString();
  }

  private getCounter(label: string | number): string | number {
    if (this.typeCheckService.isNumber(label)) {
      return label > 0 ? label : this.EMPTY_VALUE;
    } else {
      return label || this.EMPTY_VALUE;
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

  private counterSpecificationsAreNotEmpty(counter: CounterSpecifications): boolean {
    return (
      counter.type !== null && counter.type !== undefined && counter.label !== this.EMPTY_VALUE && counter.counter !== this.EMPTY_VALUE
    );
  }
}
