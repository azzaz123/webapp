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
    this.typeSpecifications = [
      {
        type: this.getBodyType(this.car.bodyType),
      },
      {
        type: CAR_SPECIFICATION_TYPE.SEATS,
        label: this.car.numSeats.toString(),
      },
      {
        type: this.getDoorsType(this.car.numDoors),
        label: this.car.numDoors.toString(),
      },
      {
        type: CAR_SPECIFICATION_TYPE[this.car.engine.toUpperCase()],
      },
      {
        type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
        label: `${this.car.horsepower} cv`,
      },
      {
        type: CAR_SPECIFICATION_TYPE[this.car.gearbox.toUpperCase()],
      },
    ];
  }

  private getBodyType(bodyType: string): CAR_SPECIFICATION_TYPE {
    if (bodyType === 'coupe_cabrio') return CAR_SPECIFICATION_TYPE.COUPE;
    return CAR_SPECIFICATION_TYPE[bodyType.toUpperCase()];
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
