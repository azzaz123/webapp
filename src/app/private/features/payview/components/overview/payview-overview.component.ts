import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-payview-overview',
  templateUrl: './payview-overview.component.html',
  styleUrls: ['./payview-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewOverviewComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
  }
}
