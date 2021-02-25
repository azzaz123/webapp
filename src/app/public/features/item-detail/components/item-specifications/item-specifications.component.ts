import { Component, Input } from '@angular/core';
import { CounterSpecifications } from './interfaces/item.specifications.interface';

@Component({
  selector: 'tsl-item-specifications',
  templateUrl: './item-specifications.component.html',
  styleUrls: ['./item-specifications.component.scss'],
})
export class ItemSpecificationsComponent {
  @Input() itemSpecifications: CounterSpecifications[];
  @Input() isCar = false;
}
