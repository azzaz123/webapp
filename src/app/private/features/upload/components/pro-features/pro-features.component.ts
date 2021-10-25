import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfigurationAdditionalServicesUpload,
  ClickConfirmAdditionalServicesUpload,
  ClickWarrantyAdditionalServicesUpload,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ClickInstallationAdditionalServicesUpload } from '@core/analytics/resources/events-interfaces/click-installation-additional-services-upload.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';

@Component({
  selector: 'tsl-pro-features',
  templateUrl: './pro-features.component.html',
  styleUrls: ['./pro-features.component.scss'],
})
export class ProFeaturesComponent implements OnChanges, OnInit {
  @Input() categoryId: number;
  @Input() clickSave: boolean;
  public proFeaturesForm: FormGroup;

  public readonly fieldsConfig: { text: string; eventName: ANALYTICS_EVENT_NAMES }[] = [
    {
      text: $localize`:@@additional_services_selector_pro_user_install_service_info_title:Installation service`,
      eventName: ANALYTICS_EVENT_NAMES.ClickInstallationAdditionalServicesUpload,
    },
    {
      text: $localize`:@@additional_services_selector_pro_user_config_service_info_title:Configuration service`,
      eventName: ANALYTICS_EVENT_NAMES.ClickConfigurationAdditionalServicesUpload,
    },
    {
      text: $localize`:@@additional_services_selector_pro_user_guarantee_service_info_title:Guarantee`,
      eventName: ANALYTICS_EVENT_NAMES.ClickWarrantyAdditionalServicesUpload,
    },
  ];
  constructor(private analyticsService: AnalyticsService, private modalService: NgbModal, private fb: FormBuilder) {}

  public onClick(isActive: boolean, eventName: ANALYTICS_EVENT_NAMES): void {
    this.openModal();
    this.trackEvent(isActive, eventName);
  }

  ngOnChanges(changes?: SimpleChanges) {
    if (this.clickSave) {
      console.log('click');
      this.trackSubmit();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.proFeaturesForm = this.fb.group({
      installation: [false],
      configuration: [false],
      warranty: [false],
    });
  }

  private openModal(): void {
    const modal = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });
    modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.simulation];
  }

  private trackEvent(isActive: boolean, eventName: ANALYTICS_EVENT_NAMES): void {
    const event: AnalyticsEvent<
      ClickInstallationAdditionalServicesUpload | ClickConfigurationAdditionalServicesUpload | ClickWarrantyAdditionalServicesUpload
    > = {
      name: eventName,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        switchOn: isActive,
        categoryId: +this.categoryId,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  private trackSubmit(): void {
    const event: AnalyticsEvent<ClickConfirmAdditionalServicesUpload> = {
      name: ANALYTICS_EVENT_NAMES.ClickConfirmAdditionalServicesUpload,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        categoryId: +this.categoryId,
        ...this.proFeaturesForm.getRawValue(),
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
