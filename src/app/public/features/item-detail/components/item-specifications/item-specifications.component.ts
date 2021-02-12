import { Component, Input, OnInit } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';

export enum CAR_BODYTYPE {
  coupe,
  family_car,
}
export interface counterSpecifications {
  type?: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  counter?: string | number;
  label?: string;
}

@Component({
  selector: 'tsl-item-specifications',
  templateUrl: './item-specifications.component.html',
  styleUrls: ['./item-specifications.component.scss'],
})
export class ItemSpecificationsComponent implements OnInit {
  @Input() item: any;
  public car: Car;
  public realEstate: Realestate;
  public typeSpecifications: counterSpecifications[];
  constructor() {}

  ngOnInit(): void {
    if (this.item.categoryId === CATEGORY_IDS.CAR) {
      this.car = this.item;
      this.setCarSpecifications();
    }
  }

  private setCarSpecifications(): void {
    const carSpecifications = [
      {
        type: this.getCarSpecificationType(this.car.bodyType),
      },
      {
        type: CAR_SPECIFICATION_TYPE.SEATS,
        label: this.getCarLabel(this.car.numSeats),
      },
      {
        type: this.getDoorsType(this.car.numDoors),
        label: this.getCarLabel(this.car.numDoors),
      },
      {
        type: this.getCarSpecificationType(this.car.engine),
      },
      {
        type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
        label: this.getCarLabel(this.car.horsepower, true),
      },
      {
        type: this.getCarSpecificationType(this.car.gearbox),
      },
      {
        type: this.getCarSpecificationType(this.car.condition),
      },
    ];

    if (this.car.bodyType === 'others') carSpecifications.shift();
    this.typeSpecifications = carSpecifications.filter((val) => val.type !== null && val.type !== undefined && val.label !== 'EMPTY');
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
