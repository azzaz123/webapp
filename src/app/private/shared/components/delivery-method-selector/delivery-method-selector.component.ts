import { Component, Input } from '@angular/core';
import { AcceptScreenCarrier } from '@private/features/accept-screen/interfaces/accept-screen-carrier.interface';

@Component({
  selector: 'tsl-delivery-method-selector',
  templateUrl: './delivery-method-selector.component.html',
  styleUrls: ['./delivery-method-selector.component.scss'],
})
export class DeliveryMethodSelectorComponent {
  @Input() title: string;
  @Input() deliveryMethods: AcceptScreenCarrier[];
}
