import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYC_DOCUMENTATION } from '../../constants/kyc-documentation-constants';
import { KYC_NATIONALITIES } from '../../constants/kyc-nationalities-constants';
import { KYC_NATIONALITY_TYPE } from '../../enums/kyc-nationality-type.enum';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';

import { KYCNationalityComponent } from './kyc-nationality.component';

describe('KYCNationalityComponent', () => {
  const EUROPEAN_UNION_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.EUROPEAN_UNION);
  const UK_USA_CA_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.UK_USA_CANADA);
  const OTHER_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.OTHER);

  const titleSelector = '.KYCNationality__title';
  const descriptionSelector = '.KYCNationality__description';
  const headerSelector = '#headerMessage';
  const backButtonSelector = '.KYCNationality__back';
  const drawingSelector = '.KYCNationality__drawing';

  let component: KYCNationalityComponent;
  let kycTrackingEventsService: KYCTrackingEventsService;
  let fixture: ComponentFixture<KYCNationalityComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KYCNationalityComponent, SvgIconComponent, DropdownComponent],
      providers: [
        {
          provide: KYCTrackingEventsService,
          useValue: {
            trackViewKYCIdentityVerificationScreen() {},
            trackViewKYCUploadIdentityVerificationScreen() {},
            trackViewKYCDocumentationTypeScreen() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCNationalityComponent);
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we enter on the KYC nationality page...', () => {
    it('should request to the KYC analytics service to track the page view event', () => {
      spyOn(kycTrackingEventsService, 'trackViewKYCIdentityVerificationScreen');

      fixture.detectChanges();

      expect(kycTrackingEventsService.trackViewKYCIdentityVerificationScreen).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the nationality has been selected...', () => {
    it('should show the select document title', () => {
      const documentTitleTranslation = $localize`:@@kyc_select_document_view_title:Select a document type`;
      component.KYCNationality = KYC_NATIONALITIES[0];

      fixture.detectChanges();

      expect(el.querySelector(titleSelector).innerHTML).toEqual(documentTitleTranslation);
    });

    it('should show the select document description', () => {
      const documentDescriptionTranslation = $localize`:@@kyc_select_document_view_description:Make sure the document you provide is valid for at least 3 months.`;
      component.KYCNationality = KYC_NATIONALITIES[0];

      fixture.detectChanges();

      expect(el.querySelector(descriptionSelector).innerHTML).toEqual(documentDescriptionTranslation);
    });

    describe('and the selected nationality is europa...', () => {
      beforeEach(() => {
        component.KYCNationality = EUROPEAN_UNION_NATIONALITY;

        fixture.detectChanges();
      });

      it('should show the european title as header', () => {
        expect(el.querySelector(headerSelector).innerHTML).toEqual(EUROPEAN_UNION_NATIONALITY.headerText);
      });

      it('should show the european drawing', () => {
        const element = de.query(By.css(drawingSelector)).query(By.directive(SvgIconComponent));
        const child: SvgIconComponent = element.componentInstance;

        expect(child.src).toBe(EUROPEAN_UNION_NATIONALITY.svgPath);
      });

      it('should show the available european documents as options in the dropdown', () => {
        const dropdown: DropdownComponent = de.query(By.directive(DropdownComponent)).componentInstance;

        expect(dropdown.options).toBe(EUROPEAN_UNION_NATIONALITY.availableDocuments);
      });
    });

    describe('and the selected nationality is uk, usa or ca...', () => {
      beforeEach(() => {
        component.KYCNationality = UK_USA_CA_NATIONALITY;

        fixture.detectChanges();
      });

      it('should show the uk, usa or ca title as header', () => {
        expect(el.querySelector(headerSelector).innerHTML).toEqual(UK_USA_CA_NATIONALITY.headerText);
      });

      it('should show the uk, usa or ca drawing', () => {
        const element = de.query(By.css(drawingSelector)).query(By.directive(SvgIconComponent));
        const child: SvgIconComponent = element.componentInstance;

        expect(child.src).toBe(UK_USA_CA_NATIONALITY.svgPath);
      });

      it('should show the available uk, usa or ca documents as options in the dropdown', () => {
        const dropdown: DropdownComponent = de.query(By.directive(DropdownComponent)).componentInstance;

        expect(dropdown.options).toBe(UK_USA_CA_NATIONALITY.availableDocuments);
      });
    });

    describe('and the selected nationality is another one...', () => {
      beforeEach(() => {
        component.KYCNationality = OTHER_NATIONALITY;

        fixture.detectChanges();
      });

      it('should show the other nationality title as header', () => {
        expect(el.querySelector(headerSelector).innerHTML).toEqual(OTHER_NATIONALITY.headerText);
      });

      it('should show the other nationality drawing', () => {
        const element = de.query(By.css(drawingSelector)).query(By.directive(SvgIconComponent));
        const child: SvgIconComponent = element.componentInstance;

        expect(child.src).toBe(OTHER_NATIONALITY.svgPath);
      });

      it('should show the passaport document as option in the dropdown', () => {
        const dropdown: DropdownComponent = de.query(By.directive(DropdownComponent)).componentInstance;

        expect(dropdown.options).toBe(OTHER_NATIONALITY.availableDocuments);
      });
    });

    describe('and the user clicks on back button', () => {
      describe('and the nationality is defined...', () => {
        beforeEach(() => {
          spyOn(component.goBack, 'emit');
          spyOn(component.nationalityChange, 'emit');
          spyOn(component.documentToRequestChange, 'emit');

          component.KYCNationality = KYC_NATIONALITIES[0];
          fixture.detectChanges();
          de.query(By.css(backButtonSelector)).nativeElement.click();
        });

        it('should reset the selected nationality', () => {
          expect(component.nationalityChange.emit).toHaveBeenCalledWith(null);
        });

        it('should reset the selected documentation', () => {
          expect(component.documentToRequestChange.emit).toHaveBeenCalledWith(null);
        });

        it('should NOT notify to go to the previous step', () => {
          expect(component.goBack.emit).not.toHaveBeenCalled();
        });
      });

      describe('and the nationality is NOT defined...', () => {
        beforeEach(() => {
          spyOn(component.goBack, 'emit');

          component.KYCNationality = null;
          fixture.detectChanges();
          de.query(By.css(backButtonSelector)).nativeElement.click();
        });

        it('should notify to go to the previous step', () => {
          expect(component.goBack.emit).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the nationality has not been selected yet...', () => {
    beforeEach(() => {
      component.KYCNationality = null;

      fixture.detectChanges();
    });

    it('should show the select nationality title', () => {
      const nationalityTitleTranslation = $localize`:@@kyc_select_nationality_view_title:Tell us where you're from...`;

      expect(el.querySelector(titleSelector).innerHTML).toEqual(nationalityTitleTranslation);
    });

    it('should show the select nationality description', () => {
      const nationalityDescriptionTranslation = $localize`:@@kyc_select_nationality_view_description:And we'll tell you what kind of document you can use to verify your identity`;

      expect(el.querySelector(descriptionSelector).innerHTML).toEqual(nationalityDescriptionTranslation);
    });

    it('should show the select nationality header', () => {
      const nationalityHeaderTranslation = $localize`:@@kyc_select_nationality_view_top_bar_title:Nationality`;

      expect(el.querySelector(headerSelector).innerHTML).toEqual(nationalityHeaderTranslation);
    });

    it('should show the select nationality drawing', () => {
      const nationalityDrawing = '/assets/icons/wallet/kyc/stepper/kyc_nationality.svg';
      const element = de.query(By.css(drawingSelector)).query(By.directive(SvgIconComponent));
      const child: SvgIconComponent = element.componentInstance;

      expect(child.src).toBe(nationalityDrawing);
    });

    it('should show the available nationalities in the dropdown', () => {
      const dropdown: DropdownComponent = de.query(By.directive(DropdownComponent)).componentInstance;

      expect(dropdown.options).toBe(KYC_NATIONALITIES);
    });

    describe('and the user clicks on back button', () => {
      it('should emit the go back event to go to the previous step', () => {
        spyOn(component.goBack, 'emit');

        de.query(By.css(backButtonSelector)).nativeElement.click();

        expect(component.goBack.emit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when we select a nationality...', () => {
    beforeEach(() => {
      spyOn(kycTrackingEventsService, 'trackViewKYCUploadIdentityVerificationScreen');
      spyOn(component.nationalityChange, 'emit');

      fixture.detectChanges();

      de.query(By.directive(DropdownComponent)).triggerEventHandler('selected', {
        label: EUROPEAN_UNION_NATIONALITY.label,
        value: EUROPEAN_UNION_NATIONALITY.value,
      });
    });

    it('should emit the selected nationality', () => {
      expect(component.nationalityChange.emit).toHaveBeenCalledWith(EUROPEAN_UNION_NATIONALITY);
    });

    it('should request to the KYC analytics service to track the event', () => {
      expect(kycTrackingEventsService.trackViewKYCUploadIdentityVerificationScreen).toHaveBeenCalledTimes(1);
      expect(kycTrackingEventsService.trackViewKYCUploadIdentityVerificationScreen).toHaveBeenCalledWith(
        EUROPEAN_UNION_NATIONALITY.analyticsName
      );
    });
  });

  describe('when we select a document...', () => {
    beforeEach(() => {
      spyOn(kycTrackingEventsService, 'trackViewKYCDocumentationTypeScreen');
      spyOn(component.documentToRequestChange, 'emit');
      component.KYCNationality = EUROPEAN_UNION_NATIONALITY;

      fixture.detectChanges();

      de.query(By.directive(DropdownComponent)).triggerEventHandler('selected', KYC_DOCUMENTATION[0]);
    });

    it('should emit the selected document', () => {
      expect(component.documentToRequestChange.emit).toHaveBeenCalledWith(KYC_DOCUMENTATION[0]);
    });

    it('should request to the KYC analytics service to track the event', () => {
      expect(kycTrackingEventsService.trackViewKYCDocumentationTypeScreen).toHaveBeenCalledTimes(1);
      expect(kycTrackingEventsService.trackViewKYCDocumentationTypeScreen).toHaveBeenCalledWith(KYC_DOCUMENTATION[0].analyticsName);
    });
  });

  describe('when we click on the cross button...', () => {
    beforeEach(() => {
      spyOn(component.closeModal, 'emit');

      fixture.debugElement.query(By.css('.KYCNationality__cross')).nativeElement.click();
    });

    it('should close the modal', () => {
      expect(component.closeModal.emit).toHaveBeenCalledTimes(1);
    });
  });
});
