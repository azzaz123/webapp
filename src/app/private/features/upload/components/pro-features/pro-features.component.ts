import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';

@Component({
  selector: 'tsl-pro-features',
  templateUrl: './pro-features.component.html',
  styleUrls: ['./pro-features.component.scss'],
})
export class ProFeaturesComponent {
  constructor(private trackingService: AnalyticsService, private modalService: NgbModal) {}

  public onClick(): void {
    this.openModal();
  }

  private openModal(): void {
    this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });
  }
}
