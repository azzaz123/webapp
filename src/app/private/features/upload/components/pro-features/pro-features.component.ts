import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ClickInstallationAdditionalServicesUpload } from '@core/analytics/resources/events-interfaces/click-installation-additional-services-upload.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';

@Component({
  selector: 'tsl-pro-features',
  templateUrl: './pro-features.component.html',
  styleUrls: ['./pro-features.component.scss'],
})
export class ProFeaturesComponent {
  @Input() categoryId;
  constructor(private analyticsService: AnalyticsService, private modalService: NgbModal) {}

  public onClick(isActive: boolean): void {
    this.openModal();
    this.trackEvent(isActive);
  }

  private openModal(): void {
    const modal = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });
    modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.simulation];
  }

  private trackEvent(isActive: boolean): void {
    const event: AnalyticsEvent<ClickInstallationAdditionalServicesUpload> = {
      name: ANALYTICS_EVENT_NAMES.ClickInstallationAdditionalServicesUpload,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        switchOn: isActive,
        categoryId: this.categoryId,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
