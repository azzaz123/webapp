import { Component, OnDestroy, ViewChild } from '@angular/core';
import { KYCError } from '@api/core/errors/payments/kyc';
import { KYCService } from '@api/payments/kyc/kyc.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { KYC_TAKE_IMAGE_OPTIONS } from '../../components/kyc-image-options/kyc-image-options.enum';
import { KYC_MODAL_STATUS_PROPERTIES } from '../../constants/kyc-modal-status-constants';
import { KYC_MODAL_STATUS } from '../../enums/kyc-modal-status.enum';
import { KYCModalProperties } from '../../interfaces/kyc-modal-properties.interface';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';
import { KYCStoreService } from '../../services/kyc-store/kyc-store.service';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';

@Component({
  selector: 'tsl-kyc-modal',
  templateUrl: './kyc-modal.component.html',
  styleUrls: ['./kyc-modal.component.scss'],
})
export class KYCModalComponent implements OnDestroy {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public KYCStoreSpecifications$: Observable<KYCSpecifications> = this.KYCStoreService.specifications$;
  public KYCStatusInProgressProperties: KYCModalProperties = KYC_MODAL_STATUS_PROPERTIES.find(
    (properties) => properties.status === KYC_MODAL_STATUS.IN_PROGRESS
  );
  public isEndVerificationLoading = false;

  private KYCModalCloseWarningCopy = $localize`:@@kyc_cancellation_system_modal_description_web_specific:Are you sure you want to get out of the process? All information will be lost.`;

  constructor(
    private KYCStoreService: KYCStoreService,
    private KYCService: KYCService,
    private activeModal: NgbActiveModal,
    private toastService: ToastService,
    private kycTrackingEventsService: KYCTrackingEventsService
  ) {}

  ngOnDestroy(): void {
    this.resetSpecifications();
  }

  public endVerification(KYCImages: KYCImages): void {
    if (this.isEndVerificationLoading) return;

    const selectedDocument = this.KYCStoreService.specifications.documentation.analyticsName;
    this.kycTrackingEventsService.trackClickKYCFinishIdentityVerification(selectedDocument);
    this.isEndVerificationLoading = true;

    this.KYCService.request(KYCImages)
      .pipe(
        finalize(() => {
          this.isEndVerificationLoading = false;
        })
      )
      .subscribe(
        () => {
          this.updateKYCImages(KYCImages);
          this.goNextStep();
        },
        (e: Error[] | KYCError[]) => {
          this.handleKYCError(e[0]);
        }
      );
  }

  public defineNationality(nationalitySelected: KYCNationality): void {
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, nationality: nationalitySelected };
  }

  public defineDocumentationAndGoNext(documentationSelected: KYCDocumentation): void {
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, documentation: documentationSelected };
    if (documentationSelected) {
      this.goNextStep();
    }
  }

  public defineImageMethodAndGoNext(takeImageMethod: KYC_TAKE_IMAGE_OPTIONS): void {
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, imageMethod: takeImageMethod };
    this.goNextStep();
  }

  public resetKYCDocumentationAndGoPreviousStep(): void {
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, documentation: null };
    this.goPreviousStep();
  }

  public closeModal(): void {
    const isInLastStep = this.stepper.activeId === 4;
    const shouldCloseModal = isInLastStep ? true : window.confirm(this.KYCModalCloseWarningCopy);
    if (shouldCloseModal) {
      this.activeModal.close();
    }
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }

  private updateKYCImages(newImages: KYCImages): void {
    this.KYCStoreService.specifications = {
      ...this.KYCStoreService.specifications,
      images: {
        frontSide: newImages.frontSide,
        backSide: newImages.backSide,
      },
    };
  }

  private resetSpecifications(): void {
    this.KYCStoreService.specifications = {
      ...this.KYCStoreService.specifications,
      nationality: null,
      documentation: null,
      imageMethod: null,
      images: {
        frontSide: null,
        backSide: null,
      },
    };
  }

  private handleKYCError(e: Error | KYCError): void {
    let errorMessage = e?.message ? e.message : $localize`:@@kyc_failed_snackbar_unknown_error_web_specific:Oops! There was an error.`;

    if (e instanceof KYCError) {
      errorMessage = e.message;
    }

    this.showToast(errorMessage, TOAST_TYPES.ERROR);
  }

  private showToast(text: string, type: TOAST_TYPES): void {
    this.toastService.show({
      text,
      type,
    });
  }
}
