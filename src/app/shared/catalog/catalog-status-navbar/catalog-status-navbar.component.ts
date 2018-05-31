import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Counters } from '../../../core/user/user-stats.interface';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-catalog-status-navbar',
  templateUrl: './catalog-status-navbar.component.html',
  styleUrls: ['./catalog-status-navbar.component.scss']
})
export class CatalogStatusNavbarComponent implements OnInit {

  @Input() selectedStatus: string;
  @Input() counters: Counters;
  @Input() subscriptionPlan: number;
  @Output() public filterByStatus: EventEmitter<any> = new EventEmitter();
  private page: number;
  public bumpsCounter: number;

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.getBumpedCounter();
  }

  public selectStatus(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.filterByStatus.emit(status);
  }
  
  private getBumpedCounter(): void {
    this.paymentService.getStatus().subscribe((status: ScheduledStatus) => {
      if (status.purchased) {
        this.bumpsCounter = status.purchased.citybump + status.purchased.countrybump;
      }
    });
  }

}
