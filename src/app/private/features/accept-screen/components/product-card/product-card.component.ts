import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
}
