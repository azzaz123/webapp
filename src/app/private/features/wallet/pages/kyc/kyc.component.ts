import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { KYC_DOCUMENTATION } from './constants/kyc-documentation-constants';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;
  public photosToTake: number;

  public definePhotosAndGoNext($event: string): void {
    this.photosToTake = KYC_DOCUMENTATION.find((document) => document.value === $event)?.photosNeeded;
    this.goNextStep();
  }

  public goNextStep(): void {
    this.stepper.goNext();
  }

  public goPreviousStep(): void {
    this.stepper.goBack();
  }
}
