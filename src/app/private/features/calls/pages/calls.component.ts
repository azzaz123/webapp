import { takeWhile } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Call } from '@core/conversation/calls';
import { CallsService } from '@core/conversation/calls.service';

@Component({
  selector: 'tsl-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss'],
})
export class CallsComponent implements OnInit, OnDestroy {
  public loading = true;
  public calls: Call[] = [];
  public archive = false;
  public status: string;
  private page = 1;
  private callsSubscription: Subscription;
  private active = true;

  constructor(private callService: CallsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loading = true;
    this.route.queryParams
      .pipe(
        takeWhile(() => {
          return this.active;
        })
      )
      .subscribe((params: any) => {
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
    this.callsSubscription = this.callService
      .getPage(this.page, this.archive, this.status)
      .pipe(
        takeWhile(() => {
          return this.active;
        })
      )
      .subscribe((calls: Call[]) => {
        this.calls = calls;
        this.loading = false;
      });
  }

  public filterByArchived(archive: boolean) {
    this.archive = archive;
    this.page = 1;
    this.loading = true;
    this.getCalls();
  }
}
