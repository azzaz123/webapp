import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { KYC_TAKE_IMAGE_OPTIONS } from './components/kyc-image-options/kyc-image-options.enum';
import { KYCStoreService } from './services/kyc-store.service';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;

  constructor(private KYCStoreService: KYCStoreService) {}

  public defineImageMethodAndGoNext(takeImageMethod: KYC_TAKE_IMAGE_OPTIONS): void {
    this.takeImageMethod = takeImageMethod;
    this.goNextStep();
  }

  public resetKYCDocumentationAndGoPreviousStep(): void {
    this.KYCStoreService.documentation = null;
    this.goPreviousStep();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }
}
