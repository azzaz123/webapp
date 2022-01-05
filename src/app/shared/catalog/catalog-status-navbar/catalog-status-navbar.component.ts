import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Counters } from '../../../core/user/user-stats.interface';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { EventService } from '../../../core/event/event.service';

@Component({
  selector: 'tsl-catalog-status-navbar',
  templateUrl: './catalog-status-navbar.component.html',
  styleUrls: ['./catalog-status-navbar.component.scss'],
})
export class CatalogStatusNavbarComponent implements OnInit {
  @Input() selectedStatus: string;
  @Input() counters: Counters;
  @Input() subscriptionPlan: number;
  @Output() public filterByStatus: EventEmitter<any> = new EventEmitter();
  public bumpsCounter = 0;
  private page: number;

  constructor(private paymentService: PaymentService, private eventService: EventService) {}

  ngOnInit() {
    this.getBumpedCounter();
    this.eventService.subscribe('itemChanged', () => {
      this.getBumpedCounter();
    });
  }

  public selectStatus(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.filterByStatus.emit(status);
  }

  private getBumpedCounter(): void {
    this.paymentService.getStatus().subscribe((status: ScheduledStatus) => {
      if (status.purchased) {
        const cityBump = status.purchased.citybump ? status.purchased.citybump : 0;
        const zoneBump = status.purchased.zonebump ? status.purchased.zonebump : 0;
        const countryBump = status.purchased.countrybump ? status.purchased.countrybump : 0;
        const urgent = status.purchased.urgent ? status.purchased.urgent : 0;
        this.bumpsCounter = cityBump + zoneBump + countryBump + urgent;
      }
      if (status.items_scheduled_purchases) {
        const cityBump = status.items_scheduled_purchases.citybump ? status.items_scheduled_purchases.citybump : 0;
        const zoneBump = status.items_scheduled_purchases.zonebump ? status.items_scheduled_purchases.zonebump : 0;
        const countryBump = status.items_scheduled_purchases.countrybump ? status.items_scheduled_purchases.countrybump : 0;
        this.bumpsCounter += cityBump + zoneBump + countryBump;
      }
    });
  }
}
