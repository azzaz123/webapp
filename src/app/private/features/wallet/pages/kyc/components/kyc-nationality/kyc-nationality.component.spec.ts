import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYC_DOCUMENTATION } from '../../constants/kyc-documentation-constants';
import { KYC_NATIONALITIES } from '../../constants/kyc-nationalities-constants';
import { KYC_NATIONALITY_TYPE } from '../../enums/kyc-nationality-type-enum';

import { KYCNationalityComponent } from './kyc-nationality.component';

describe('KYCNationalityComponent', () => {
  const EUROPEAN_UNION_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.EUROPEAN_UNION);
  const UK_USA_CA_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.UK_USA_CANADA);
  const OTHER_NATIONALITY = KYC_NATIONALITIES.find((nationality) => nationality.value === KYC_NATIONALITY_TYPE.OTHER);

  const titleSelector = '.KYCNationality__title';
  const descriptionSelector = '.KYCNationality__description';
  const headerSelector = '.KYCNationality__header';
  const backButtonSelector = '.KYCNationality__back';
  const drawingSelector = '.KYCNationality__drawing';

  let component: KYCNationalityComponent;
  let fixture: ComponentFixture<KYCNationalityComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KYCNationalityComponent, SvgIconComponent, DropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCNationalityComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the nationality has been selected...', () => {
    it('should show the select document title', () => {
      const documentTitleTranslation = $localize`:@@kyc_select_document_view_title:Select a document type`;
      component.selectedNationality = KYC_NATIONALITIES[0];

      fixture.detectChanges();

      expect(el.querySelector(titleSelector).innerHTML).toEqual(documentTitleTranslation);
    });

    it('should show the select document description', () => {
      const documentDescriptionTranslation = $localize`:@@kyc_select_document_view_description:Make sure the document you provide is valid for at least 3 months.`;
      component.selectedNationality = KYC_NATIONALITIES[0];

      fixture.detectChanges();

      expect(el.querySelector(descriptionSelector).innerHTML).toEqual(documentDescriptionTranslation);
    });

    describe('and the selected nationality is europa...', () => {
      beforeEach(() => {
        component.selectedNationality = EUROPEAN_UNION_NATIONALITY;

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
        component.selectedNationality = UK_USA_CA_NATIONALITY;

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
        component.selectedNationality = OTHER_NATIONALITY;

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
      it('should reset the selected nationality', () => {
        component.selectedNationality = KYC_NATIONALITIES[0];

        fixture.detectChanges();
        de.query(By.css(backButtonSelector)).nativeElement.click();

        expect(component.selectedNationality).toBe(null);
      });
    });
  });

  describe('when the nationality has not been selected yet...', () => {
    beforeEach(() => {
      component.selectedNationality = null;

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
      component.selectedNationality = null;

      fixture.detectChanges();
    });

    it('should define the selected nationality', () => {
      de.query(By.directive(DropdownComponent)).triggerEventHandler('selected', {
        label: EUROPEAN_UNION_NATIONALITY.label,
        value: EUROPEAN_UNION_NATIONALITY.value,
      });

      expect(component.selectedNationality).toBe(EUROPEAN_UNION_NATIONALITY);
    });
  });

  describe('when we select a document...', () => {
    const selectedDocument = KYC_DOCUMENTATION[0];

    beforeEach(() => {
      spyOn(component.photosToRequestChange, 'emit');
      component.selectedNationality = EUROPEAN_UNION_NATIONALITY;

      fixture.detectChanges();
    });

    it('should emit the needed photos', () => {
      de.query(By.directive(DropdownComponent)).triggerEventHandler('selected', {
        label: selectedDocument.label,
        value: selectedDocument.value,
      });

      expect(component.photosToRequestChange.emit).toHaveBeenCalledWith(selectedDocument.photosNeeded);
    });
  });
});
