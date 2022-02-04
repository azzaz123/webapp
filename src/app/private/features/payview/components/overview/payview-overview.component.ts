import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tsl-payview-overview',
  templateUrl: './payview-overview.component.html',
  styleUrls: ['./payview-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewOverviewComponent {
  constructor() {}
}
