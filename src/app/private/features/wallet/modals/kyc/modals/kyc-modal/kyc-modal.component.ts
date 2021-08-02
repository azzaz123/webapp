import { Component, ViewChild } from '@angular/core';
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

  constructor(private KYCStoreService: KYCStoreService, public activeModal: NgbActiveModal) {
    this.KYCStoreSpecifications$ = KYCStoreService.specifications$;
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
}
