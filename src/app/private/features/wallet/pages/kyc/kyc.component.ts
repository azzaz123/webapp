import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { KYC_TAKE_IMAGE_OPTIONS } from './components/kyc-image-options/kyc-image-options.enum';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public readonly KYC_TAKE_IMAGE_OPTIONS = KYC_TAKE_IMAGE_OPTIONS;
  public imagesToRequest: number;
  public takeImageMethod: KYC_TAKE_IMAGE_OPTIONS;

  public defineImagesAndGoNext(imagesToRequest: number): void {
    this.imagesToRequest = imagesToRequest;
    this.goNextStep();
  }

  public defineImageMethodAndGoNext(takeImageMethod: KYC_TAKE_IMAGE_OPTIONS): void {
    this.takeImageMethod = takeImageMethod;
    this.goNextStep();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }
}
