import { Component, Input } from '@angular/core';
import { AcceptScreenCarrier } from '@private/features/accept-screen/interfaces/accept-screen-carrier.interface';

@Component({
  selector: 'tsl-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.scss'],
})
export class CarriersComponent {
  @Input() title: string;
  @Input() carriers: AcceptScreenCarrier[];
}
