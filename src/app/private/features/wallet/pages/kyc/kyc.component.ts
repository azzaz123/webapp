import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { KYCDocumentation } from '../../interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '../../interfaces/kyc/kyc-nationality.interface';
import { KYC_TAKE_IMAGE_OPTIONS } from './components/kyc-image-options/kyc-image-options.enum';
import { KYCSpecifications } from './interfaces/kyc-specifications.interface';
import { KYCStoreService } from './services/kyc-store.service';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public KYCStoreSpecifications$: Observable<KYCSpecifications>;

  constructor(private KYCStoreService: KYCStoreService) {
    this.KYCStoreSpecifications$ = KYCStoreService.specifications$;
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

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }
}
