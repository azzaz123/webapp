import { Component, Input, OnInit } from '@angular/core';
import { ItemSpecification } from '@public/core/constants/item-specifications-constants';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { COUNTER_TYPE } from './constants/counter-type-constants';

@Component({
  selector: 'tsl-counter-specification',
  templateUrl: './counter-specification.component.html',
  styleUrls: ['./counter-specification.component.scss'],
})
export class CounterSpecificationComponent implements OnInit {
  @Input() type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  @Input() counter: string | number;
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {}

  get counterInfo(): ItemSpecification {
    if (this.label) {
      COUNTER_TYPE.find((counter) => counter.type === this.type);
    } else {
      return null;
    }
  }
}
