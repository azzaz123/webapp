import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { isNil } from '@features/upload/components/drop-area/node_modules/lodash-es';

@Component({
  selector: 'tsl-user-response-rate',
  templateUrl: './user-response-rate.component.html',
  styleUrls: ['./user-response-rate.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserResponseRateComponent {
  @Input() responseRate: string;
  @Input() showIcon = true;

  public isNullOrUndefined(): boolean {
    return isNil(this.responseRate);
  }
}
