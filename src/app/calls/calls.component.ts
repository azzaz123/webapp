import { Component, OnInit, OnDestroy } from '@angular/core';
import { Call } from '../core/conversation/calls';
import { Subscription } from 'rxjs/Subscription';
import { CallsService } from '../core/conversation/calls.service';
import { TrackingService } from '../core/tracking/tracking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tsl-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit, OnDestroy {

  private page = 1;
  public loading = true;
  public calls: Call[] = [];
  public archive = false;
  public status: string;
  private callsSubscription: Subscription;
  private active = true;

  constructor(private callService: CallsService,
    private trackingService: TrackingService,
    private route: ActivatedRoute) {
}

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.takeWhile(() => {
      return this.active;
    }).subscribe((params: any) => {
      this.status = params.status;
      this.getCalls();
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public loadMore() {
    this.page++;
    this.getCalls();
  }

  public getCalls() {
    if (this.callsSubscription) {
      this.callsSubscription.unsubscribe();
    }
    this.callsSubscription = this.callService.getPage(this.page, this.archive, this.status).takeWhile(() => {
      return this.active;
    }).subscribe((calls: Call[]) => {
      this.calls = calls;
      this.loading = false;
      if (this.archive) {
        this.trackingService.track(TrackingService.PHONE_LEAD_LIST_PROCESSED_LOADED);
      } else {
        this.trackingService.track(TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED);
      }
    });
  }

  public filterByArchived(archive: boolean) {
    this.archive = archive;
    this.page = 1;
    this.loading = true;
    this.getCalls();
  }
}
