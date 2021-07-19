import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { KYC_NATIONALITIES } from '../../constants/kyc-nationalities-constants';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYC_DOCUMENTATION } from '../../constants/kyc-documentation-constants';

@Component({
  selector: 'tsl-kyc-nationality',
  templateUrl: './kyc-nationality.component.html',
  styleUrls: ['./kyc-nationality.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCNationalityComponent {
  @Output() photosToRequestSelect: EventEmitter<number> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public selectedNationality: KYCNationality;
  public readonly KYC_NATIONALITIES = KYC_NATIONALITIES;

  public emitPhotosToRequest(selectedDocument: IOption): void {
    const photosNeeded = KYC_DOCUMENTATION.find((document) => document.value === selectedDocument.value).photosNeeded;
    this.photosToRequestSelect.emit(photosNeeded);
  }

  public handleBack(): void {
    if (this.selectedNationality) {
      this.selectedNationality = null;
    } else {
      this.goBack.emit();
    }
  }

  get title(): string {
    return this.selectedNationality
      ? $localize`:@@kyc_select_document_view_title:Select a document type`
      : $localize`:@@kyc_select_nationality_view_title:Tell us where you're from...`;
  }

  get description(): string {
    return this.selectedNationality
      ? $localize`:@@kyc_select_document_view_description:Make sure the document you provide is valid for at least 3 months.`
      : $localize`:@@kyc_select_nationality_view_description:And we'll tell you what kind of document you can use to verify your identity`;
  }

  get nationalityHeader(): string {
    return this.selectedNationality?.headerText || $localize`:@@kyc_select_nationality_view_top_bar_title:Nationality`;
  }

  get svgPath(): string {
    return this.selectedNationality?.svgPath || '/assets/icons/wallet/kyc/stepper/kyc_nationality.svg';
  }

  set selectNationality(selectedNationality: IOption) {
    this.selectedNationality = KYC_NATIONALITIES.find((nationality) => nationality.value === selectedNationality.value);
  }
}
