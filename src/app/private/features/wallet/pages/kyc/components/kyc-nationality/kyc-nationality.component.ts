import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { KYC_NATIONALITIES } from './kyc-nationalities-constants';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';

@Component({
  selector: 'tsl-kyc-nationality',
  templateUrl: './kyc-nationality.component.html',
  styleUrls: ['./kyc-nationality.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycNationalityComponent {
  @Output() nationalityFinished: EventEmitter<void> = new EventEmitter();
  @Output() selectedDocument: EventEmitter<string> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public selectedNationality: KYCNationality;
  public readonly KYC_NATIONALITIES = KYC_NATIONALITIES;

  constructor() {}

  public selectNationality(selectedNationality: KYCNationality): void {
    this.selectedNationality = KYC_NATIONALITIES.find((nationality) => nationality.value === selectedNationality.value);
  }

  public selectAcreditationDocument(selectedDocument: IOption): void {
    this.selectedDocument.emit(selectedDocument.value);
    this.nationalityFinished.emit();
  }

  get svgPath(): string {
    if (!this.selectedNationality) {
      return '/assets/icons/wallet/kyc/stepper/kyc_nationality.svg';
    }
    return this.selectedNationality.svgPath;
  }
}
