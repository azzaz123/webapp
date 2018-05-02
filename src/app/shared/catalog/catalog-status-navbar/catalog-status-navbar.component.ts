import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Counters } from '../../../core/user/user-stats.interface';

@Component({
  selector: 'tsl-catalog-status-navbar',
  templateUrl: './catalog-status-navbar.component.html',
  styleUrls: ['./catalog-status-navbar.component.scss']
})
export class CatalogStatusNavbarComponent implements OnInit {

  @Input() selectedStatus: string;
  @Input() counters: Counters;
  @Output() public filterByStatus: EventEmitter<any> = new EventEmitter();
  private page: number;

  constructor() { }

  ngOnInit() {
  }

  public selectStatus(status: string) {
    this.selectedStatus = status;
    this.page = 1;
    this.filterByStatus.emit(status);
  }

}
