import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '@shared/stepper/stepper.component';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;
  public photosToRequest: number;

  public definePhotosAndGoNext(photosToRequest: number): void {
    this.photosToRequest = photosToRequest;
    this.goNextStep();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }
}
