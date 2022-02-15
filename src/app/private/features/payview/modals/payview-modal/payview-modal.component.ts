import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tsl-payview-modal',
  templateUrl: './payview-modal.component.html',
  styleUrls: ['./payview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewModalComponent {
  constructor() {}
}
