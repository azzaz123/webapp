import { Component, ViewChild } from '@angular/core';
import {
  DocumentImageIsInvalidError,
  DocumentImageIsInvalidInputFileError,
  DocumentImageSizeExceededError,
  KYCError,
  MangopayUserNotFoundError,
} from '@api/core/errors/payments/kyc';
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
export class KYCModalComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
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

  public endVerification(KYCImages: KYCImages): void {
    this.KYCService.request(KYCImages).subscribe({
      error: (e: KYCError) => {
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

  public resetSpecificationsAndCloseModal(): void {
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

    this.activeModal.close();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }

  private handleKYCError(e: KYCError): void {
    let translationKey: TRANSLATION_KEY = TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR;

    if (e instanceof MangopayUserNotFoundError) {
      translationKey = TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR;
    }
    if (e instanceof DocumentImageIsInvalidInputFileError) {
      translationKey = TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR;
    }
    if (e instanceof DocumentImageIsInvalidError) {
      translationKey = TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR;
    }
    if (e instanceof DocumentImageSizeExceededError) {
      translationKey = TRANSLATION_KEY.BANK_ACCOUNT_SAVE_GENERIC_ERROR;
    }

    this.showToast(translationKey, TOAST_TYPES.ERROR);
  }

  private showToast(key: TRANSLATION_KEY, type: TOAST_TYPES): void {
    this.toastService.show({
      text: `${this.i18nService.translate(key)}`,
      type,
    });
  }
}
