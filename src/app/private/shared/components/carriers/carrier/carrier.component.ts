import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AcceptScreenCarrier } from '@private/features/accept-screen/interfaces/accept-screen-carrier.interface';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery/carrier-drop-off-mode.type';

@Component({
  selector: 'tsl-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss'],
})
export class CarrierComponent {
  @Input() carrier: AcceptScreenCarrier;
  @Output() carrierClick: EventEmitter<AcceptScreenCarrier> = new EventEmitter();

  public readonly postOfficeDropOff: number = CARRIER_DROP_OFF_MODE.POST_OFFICE;
  public readonly homePickUp: number = CARRIER_DROP_OFF_MODE.HOME_PICK_UP;
}
