import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { KYC_NATIONALITIES } from '../../constants/kyc-nationalities-constants';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYC_DOCUMENTATION } from '../../constants/kyc-documentation-constants';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';

@Component({
  selector: 'tsl-kyc-nationality',
  templateUrl: './kyc-nationality.component.html',
  styleUrls: ['./kyc-nationality.component.scss'],
})
export class KYCNationalityComponent implements OnInit {
  @Input() KYCNationality: KYCNationality;
  @Input() KYCDocumentation: KYCDocumentation;

  @Output() nationalityChange: EventEmitter<KYCNationality> = new EventEmitter();
  @Output() documentToRequestChange: EventEmitter<KYCDocumentation> = new EventEmitter();
  @Output() goBack: EventEmitter<void> = new EventEmitter();

  public readonly KYC_NATIONALITIES = KYC_NATIONALITIES;

  constructor(private kycTrackingEventsService: KYCTrackingEventsService) {}

  ngOnInit() {
    this.trackViewKYCIdentityVerificationScreen();
  }

  public emitDocumentChange(selectedDocument: IOption): void {
    const documentation = KYC_DOCUMENTATION.find((nationality) => nationality.value === selectedDocument.value);

    this.trackViewKYCDocumentationTypeScreen();
    this.documentToRequestChange.emit(documentation);
  }

  public emitNationalityChange(selectedNationality: IOption): void {
    const nationality = KYC_NATIONALITIES.find((nationality) => nationality.value === selectedNationality.value);

    this.trackViewKYCUploadIdentityVerificationScreen();
    this.nationalityChange.emit(nationality);
  }

  public handleBack(): void {
    if (this.KYCNationality) {
      this.documentToRequestChange.emit(null);
      this.nationalityChange.emit(null);
    } else {
      this.goBack.emit();
    }
  }

  get title(): string {
    return this.KYCNationality
      ? $localize`:@@kyc_select_document_view_title:Select a document type`
      : $localize`:@@kyc_select_nationality_view_title:Tell us where you're from...`;
  }

  get description(): string {
    return this.KYCNationality
      ? $localize`:@@kyc_select_document_view_description:Make sure the document you provide is valid for at least 3 months.`
      : $localize`:@@kyc_select_nationality_view_description:And we'll tell you what kind of document you can use to verify your identity`;
  }

  get header(): string {
    return this.KYCNationality?.headerText || $localize`:@@kyc_select_nationality_view_top_bar_title:Nationality`;
  }

  get svgPath(): string {
    return this.KYCNationality?.svgPath || '/assets/icons/wallet/kyc/stepper/kyc_nationality.svg';
  }

  private trackViewKYCIdentityVerificationScreen(): void {
    this.kycTrackingEventsService.trackViewKYCIdentityVerificationScreen();
  }

  private trackViewKYCUploadIdentityVerificationScreen(): void {
    this.kycTrackingEventsService.trackViewKYCUploadIdentityVerificationScreen(this.KYCNationality.analyticsName);
  }

  private trackViewKYCDocumentationTypeScreen(): void {
    this.kycTrackingEventsService.trackViewKYCDocumentationTypeScreen(this.KYCDocumentation.analyticsName);
  }
}
