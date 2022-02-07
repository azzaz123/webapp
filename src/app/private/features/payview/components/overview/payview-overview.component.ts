import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-payview-overview',
  templateUrl: './payview-overview.component.html',
  styleUrls: ['./payview-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PayviewService, PayviewStateManagementService],
})
export class PayviewOverviewComponent implements OnInit {
  @Input() public itemHash: string;

  constructor(private payviewStateManagementService: PayviewStateManagementService) {}

  public ngOnInit(): void {
    this.payviewStateManagementService.itemHash = this.itemHash;
  }

  public get payviewState$(): Observable<PayviewState> {
    return this.payviewStateManagementService.payViewState$;
  }
}
