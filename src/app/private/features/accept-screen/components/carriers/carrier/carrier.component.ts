import { Component, Input } from '@angular/core';
import { AcceptScreenCarrier } from '../../../interfaces/accept-screen-carrier.interface';

@Component({
  selector: 'tsl-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss'],
})
export class CarrierComponent {
  @Input() carrier: AcceptScreenCarrier;
}
