import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ItemSpecification } from '@public/core/constants/item-specifications-constants';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { COUNTER_TYPE } from './constants/counter-type-constants';

@Component({
  selector: 'tsl-counter-specification',
  templateUrl: './counter-specification.component.html',
  styleUrls: ['./counter-specification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterSpecificationComponent {
  @Input() type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  @Input() counter: string | number;
  @Input() label: string;

  get specificationCounter(): ItemSpecification {
    return COUNTER_TYPE.find((counter) => counter.type === this.type) || null;
  }

  get isCounterText(): boolean {
    return !!this.specificationCounter?.icon || typeof this.counter === 'string';
  }

  get translation(): string {
    if (!this.type || !this.specificationCounter?.label) return this.label;

    return this.counter === 1 || !this.counter ? this.specificationCounter?.label?.singular : this.specificationCounter?.label?.plural;
  }
}
