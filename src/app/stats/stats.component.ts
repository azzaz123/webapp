import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'tsl-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  public scrollTop: number;
  public paginate: Subject<boolean> = new Subject();
  public pagination = true;
  public loading = true;

  public loadMoreStats() {
    this.paginate.next(true);
  }

  public stopPagination() {
    this.pagination = false;
  }

  public setLoadingStatus(status: boolean) {
    this.loading = status;
  }

}
