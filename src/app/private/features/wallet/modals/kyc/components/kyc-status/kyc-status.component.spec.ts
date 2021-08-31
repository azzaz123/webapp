import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYC_MODAL_STATUS_PROPERTIES } from '../../constants/kyc-modal-status-constants';

import { KYCStatusComponent } from './kyc-status.component';

describe('KYCStatusComponent', () => {
  const KYC_STATUS_IN_PROGRESS = KYC_MODAL_STATUS_PROPERTIES[0];
  const KYC_STATUS_ERROR = KYC_MODAL_STATUS_PROPERTIES[2];
  const CSLinkSelector = '.KYCStatus__link';

  let component: KYCStatusComponent;
  let fixture: ComponentFixture<KYCStatusComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCStatusComponent, SvgIconComponent, ButtonComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive status properties...', () => {
    beforeEach(() => {
      component.properties = KYC_STATUS_IN_PROGRESS;

      fixture.detectChanges();
    });

    it('should show the title', () => {
      expect(el.querySelector('.KYCStatus__title').innerHTML).toEqual(KYC_STATUS_IN_PROGRESS.title);
    });

    it('should show the description', () => {
      expect(el.querySelector('.KYCStatus__description').innerHTML).toEqual(KYC_STATUS_IN_PROGRESS.description);
    });

    it('should show the svg with the received path', () => {
      const svg = de.query(By.directive(SvgIconComponent)).componentInstance;

      expect(svg.src).toBe(KYC_STATUS_IN_PROGRESS.svgPath);
    });

    it('should show the message CTA on the button', () => {
      const button: HTMLElement = de.query(By.directive(ButtonComponent)).nativeElement;

      expect(button.textContent).toEqual(KYC_STATUS_IN_PROGRESS.messageCTA);
    });

    describe(`and we don't need to show the CS link`, () => {
      it('should not show the link', () => {
        const link: DebugElement = de.query(By.css(CSLinkSelector));

        expect(link).toBeFalsy();
      });
    });

    describe('and we need to show the CS link', () => {
      beforeEach(() => {
        component.properties = KYC_STATUS_ERROR;

        fixture.detectChanges();
      });

      it('should show the CS link', () => {
        const CSLink: DebugElement = de.query(By.css(CSLinkSelector));

        expect(CSLink.attributes['href']).toEqual(component.CS_URL);
      });
    });

    describe('and we click on the button', () => {
      beforeEach(() => {
        spyOn(component.buttonClick, 'emit');
      });

      it('should emit the button click', () => {
        const button: HTMLElement = de.query(By.directive(ButtonComponent)).nativeElement;

        button.click();

        expect(component.buttonClick.emit).toBeCalledTimes(1);
      });
    });
  });

  describe('when we not receive status properties', () => {
    beforeEach(() => {
      component.properties = null;
    });

    it('should not show the status information', () => {
      const container: DebugElement = de.query(By.css('.KYCStatus'));

      expect(container).toBeFalsy();
    });
  });
});
