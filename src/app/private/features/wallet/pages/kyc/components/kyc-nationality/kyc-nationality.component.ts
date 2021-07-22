import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { KYC_NATIONALITIES } from '../../constants/kyc-nationalities-constants';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYCStoreService } from '../../services/kyc-store.service';
import { KYC_DOCUMENTATION } from '../../constants/kyc-documentation-constants';
import { Observable } from 'rxjs';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';

@Component({
  selector: 'tsl-kyc-nationality',
  templateUrl: './kyc-nationality.component.html',
  styleUrls: ['./kyc-nationality.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCNationalityComponent {
  @Output() documentToRequestChange: EventEmitter<void> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public KYCSpecifications$: Observable<KYCSpecifications>;
  public readonly KYC_NATIONALITIES = KYC_NATIONALITIES;

  constructor(private KYCStoreService: KYCStoreService) {
    this.KYCSpecifications$ = KYCStoreService.specifications$;
  }

  public setDocumentAndEmitDocumentChange(selectedDocument: IOption): void {
    const documentation = KYC_DOCUMENTATION.find((nationality) => nationality.value === selectedDocument.value);
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, documentation };

    this.documentToRequestChange.emit();
  }

  public handleBack(): void {
    if (this.KYCStoreService.specifications.nationality) {
      this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, nationality: null, documentation: null };
    } else {
      this.goBack.emit();
    }
  }

  public getTitle(isSelectedNationality: boolean): string {
    return isSelectedNationality
      ? $localize`:@@kyc_select_document_view_title:Select a document type`
      : $localize`:@@kyc_select_nationality_view_title:Tell us where you're from...`;
  }

  public getDescription(isSelectedNationality: boolean): string {
    return isSelectedNationality
      ? $localize`:@@kyc_select_document_view_description:Make sure the document you provide is valid for at least 3 months.`
      : $localize`:@@kyc_select_nationality_view_description:And we'll tell you what kind of document you can use to verify your identity`;
  }

  public getNationalityHeader(selectedNationalityHeaderText: string | null): string {
    return selectedNationalityHeaderText || $localize`:@@kyc_select_nationality_view_top_bar_title:Nationality`;
  }

  public getSvgPath(selectedNationalitySvgPath: string | null): string {
    return selectedNationalitySvgPath || '/assets/icons/wallet/kyc/stepper/kyc_nationality.svg';
  }

  set selectNationality(selectedNationality: IOption) {
    const nationality = KYC_NATIONALITIES.find((nationality) => nationality.value === selectedNationality.value);
    this.KYCStoreService.specifications = { ...this.KYCStoreService.specifications, nationality };
  }
}
