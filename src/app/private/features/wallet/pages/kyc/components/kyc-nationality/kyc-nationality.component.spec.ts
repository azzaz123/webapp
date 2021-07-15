import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { KycNationalityComponent } from './kyc-nationality.component';

describe('KycNationalityComponent', () => {
  const titleSelector = '.KYCNationality__title';
  const descriptionSelector = '.KYCNationality__description';
  const headerSelector = '.KYCNationality__header';
  const backButtonSelector = '.KYCNationality__back';
  const drawingSelector = '.KYCNationality__drawing';

  let component: KycNationalityComponent;
  let fixture: ComponentFixture<KycNationalityComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownModule, HttpClientTestingModule],
      declarations: [KycNationalityComponent, SvgIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycNationalityComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the nationality has been selected...', () => {
    it('should show the select document title', () => {});

    it('should show the select document description', () => {});

    describe('and the selected nationality is europa...', () => {
      it('should show the european title as header', () => {});
      it('should show the european drawing', () => {});
      it('should show the available european documents as options in the dropdown', () => {});
    });

    describe('and the selected nationality is uk, usa or ca...', () => {
      it('should show the uk, usa or ca title as header', () => {});
      it('should show the uk, usa or ca drawing', () => {});
      it('should show the available uk, usa or ca documents as options in the dropdown', () => {});
    });

    describe('and the selected nationality is another one...', () => {
      it('should show the other nationality title as header', () => {});
      it('should show the other nationality drawing', () => {});
      it('should show the passaport document as option in the dropdown', () => {});
    });

    describe('and the user clicks on back button', () => {
      it('should reset the selected nationality', () => {});
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

      expect(element).toBeTruthy();
      expect(child.src).toBe(nationalityDrawing);
    });

    it('should show the available nationalities in the dropdown', () => {});

    describe('and the user clicks on back button', () => {
      it('should emit the go back event to go to the previous step', () => {
        spyOn(component.goBack, 'emit');

        de.query(By.css(backButtonSelector)).nativeElement.click();

        expect(component.goBack.emit).toHaveBeenCalledTimes(1);
      });
    });
  });
});
