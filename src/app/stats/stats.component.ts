import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'tsl-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  public scrollTop: number;
  public paginate: Subject<boolean> = new Subject();
  public pagination = true;

  public loadMoreStats() {
    this.paginate.next(true);
  }

  public stopPagination() {
    this.pagination = false;
  }

}
