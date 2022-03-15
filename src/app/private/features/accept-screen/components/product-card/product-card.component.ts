import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { AcceptScreenBuyer, AcceptScreenItem } from '../../interfaces';

@Component({
  selector: 'tsl-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() buyer: AcceptScreenBuyer;
  @Input() item: AcceptScreenItem;
  @Input() offeredPrice: Money;
  @Output() userProfileClick: EventEmitter<void> = new EventEmitter();
  @Output() itemClick: EventEmitter<void> = new EventEmitter();
}
