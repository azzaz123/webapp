import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { IOption } from '@shared/dropdown/utils/option.interface';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const DEBOUNCE_TIME = 500;

@Component({
  selector: 'tsl-pro-features',
  templateUrl: './pro-features.component.html',
  styleUrls: ['./pro-features.component.scss'],
})
export class ProFeaturesComponent implements OnInit, OnDestroy {
  @Input() categoryId: string;

  public proFeaturesForm: FormGroup;
  public readonly clickInstallationAdditionalServicesUpload = ANALYTICS_EVENT_NAMES.ClickInstallationAdditionalServicesUpload;
  public readonly clickConfigurationAdditionalServicesUpload = ANALYTICS_EVENT_NAMES.ClickConfigurationAdditionalServicesUpload;
  public readonly clickWarrantyAdditionalServicesUpload = ANALYTICS_EVENT_NAMES.ClickWarrantyAdditionalServicesUpload;

  public readonly dropdownOptions: IOption[] = [
    {
      value: 'months',
      label: $localize`:@@additional_services_selector_pro_user_guarantee_service_info_months_unit_label:months`,
    },
    {
      value: 'years',
      label: $localize`:@@additional_services_selector_pro_user_guarantee_service_info_years_unit_label:years`,
    },
  ];
  private warrantyAmountSubscription: Subscription;

  constructor(private analyticsService: AnalyticsService, private modalService: NgbModal, private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.subscribeWarrantyAmountChanges();
  }

  public trackEvent(isActive: boolean, eventName: ANALYTICS_EVENT_NAMES): void {
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

  public trackSubmit(): void {
    const { installation, configuration, warranty } = this.proFeaturesForm.getRawValue();
    const event: AnalyticsEvent<ClickConfirmAdditionalServicesUpload> = {
      name: ANALYTICS_EVENT_NAMES.ClickConfirmAdditionalServicesUpload,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        categoryId: +this.categoryId,
        installation,
        configuration,
        warranty,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public openModal(): void {
    const modal = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });
    modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.simulation];
  }

  ngOnDestroy() {
    this.warrantyAmountSubscription.unsubscribe();
  }

  private buildForm(): void {
    this.proFeaturesForm = this.fb.group({
      installation: [false],
      configuration: [false],
      warranty: [false],
      warrantyPeriod: ['months'],
      warrantyAmount: [],
    });
  }

  private subscribeWarrantyAmountChanges() {
    this.warrantyAmountSubscription = this.proFeaturesForm
      .get('warrantyAmount')
      .valueChanges.pipe(debounceTime(DEBOUNCE_TIME))
      .subscribe(() => {
        this.openModal();
      });
  }
}
