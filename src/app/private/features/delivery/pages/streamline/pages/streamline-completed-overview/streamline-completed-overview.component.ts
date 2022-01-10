import { DELIVERY_PATHS } from './../../../../delivery-routing-constants';
import { Component } from '@angular/core';
import { PRIVATE_PATHS } from '@private//private-routing-constants';

@Component({
  selector: 'tsl-streamline-completed-overview',
  templateUrl: './streamline-completed-overview.component.html',
  styleUrls: ['./streamline-completed-overview.component.scss'],
})
export class StreamlineCompletedOverviewComponent {
  public readonly retryUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
}
