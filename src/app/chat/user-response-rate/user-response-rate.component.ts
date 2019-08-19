import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'tsl-user-response-rate',
  templateUrl: './user-response-rate.component.html',
  styleUrls: ['./user-response-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserResponseRateComponent {

  @Input() responseRate: string;
  @Input() showIcon = true;

  public isNullOrUndefined(): boolean {
    return isNullOrUndefined(this.responseRate);
  }

}
