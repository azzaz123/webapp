import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { PayviewService } from '../../services/payview.service';
import { PayviewState } from '../../interfaces/payview-state.interface';

@Component({
  selector: 'tsl-payview-overview',
  templateUrl: './payview-overview.component.html',
  styleUrls: ['./payview-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewOverviewComponent implements OnInit {
  constructor(private route: ActivatedRoute, private payviewService: PayviewService) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    debugger;
    this.payviewService.getCurrentState().subscribe((result: PayviewState) => {
      debugger;
      console.log(result);
    });
  }
}
