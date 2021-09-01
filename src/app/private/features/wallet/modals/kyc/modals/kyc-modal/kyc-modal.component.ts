import { Component, OnDestroy, ViewChild } from '@angular/core';
import { KYCError } from '@api/core/errors/payments/kyc';
import { KYCService } from '@api/payments/kyc/kyc.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { KYC_TAKE_IMAGE_OPTIONS } from '../../components/kyc-image-options/kyc-image-options.enum';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';
import { KYCStoreService } from '../../services/kyc-store/kyc-store.service';

@Component({
  selector: 'tsl-kyc-modal',
  templateUrl: './kyc-modal.component.html',
  styleUrls: ['./kyc-modal.component.scss'],
})
export class KYCModalComponent implements OnDestroy {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public KYCStoreSpecifications$: Observable<KYCSpecifications>;

  constructor(
    private KYCStoreService: KYCStoreService,
    private KYCService: KYCService,
    private activeModal: NgbActiveModal,
    private toastService: ToastService,
    private i18nService: I18nService
  ) {
    this.KYCStoreSpecifications$ = KYCStoreService.specifications$;
  }

  ngOnDestroy(): void {
    this.resetSpecifications();
  }

  public endVerification(KYCImages: KYCImages): void {
    this.KYCService.request(KYCImages).subscribe({
      error: (e: Error | KYCError) => {
        this.handleKYCError(e);
      },
    });
  }

  public defineNationality(nationalitySelected: KYCNationality): void {
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, nationality: nationalitySelected };
  }

  public defineImages(newImages: KYCImages): void {
    this.KYCStoreService.specifications = {
      ...this.KYCStoreService.specifications,
      images: {
        frontSide: newImages.frontSide,
        backSide: newImages.backSide,
      },
    };
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
    this.activeModal.close();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
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
    let errorMessage: string = `${this.i18nService.translate(TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR)}`;

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
