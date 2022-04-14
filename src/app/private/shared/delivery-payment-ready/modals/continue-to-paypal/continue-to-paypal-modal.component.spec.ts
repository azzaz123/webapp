import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueToPayPalComponent } from './continue-to-paypal-modal.component';
import { DebugElement } from '@angular/core';
import { ButtonComponent } from '@shared/button/button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { CONTINUE_TO_PAYPAL_CLOSURE_REASON } from '../../enums/continue-to-paypal-closure-reason.enum';

describe('ContinueToPayPalComponent', () => {
  let component: ContinueToPayPalComponent;
  let fixture: ComponentFixture<ContinueToPayPalComponent>;
  let de: DebugElement;

  const ContinueToPayPalSelector: string = '.ContinueToPayPal__';
  const payPalLogoSelector: string = `${ContinueToPayPalSelector}paypalLogo`;
  const descriptionSelector: string = `${ContinueToPayPalSelector}description`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContinueToPayPalComponent, ButtonComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueToPayPalComponent);
    component = fixture.componentInstance;
    component.closeCallback = (_result: CONTINUE_TO_PAYPAL_CLOSURE_REASON) => null;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the PayPal logo', () => {
    const imageSource: string = de.nativeElement.querySelector(payPalLogoSelector).src;

    expect(payPalLogoSelector).toBeTruthy();
    expect(imageSource).toContain(component.paypalIconUrl);
  });

  it('should show the description message', () => {
    const title: string = de.query(By.css(descriptionSelector)).nativeElement.innerHTML;
    const expectedTitle = $localize`:web_authorize_paypal_purchase:For your security, you will be required to authorize your purchase with PayPal`;

    expect(title).toBe(expectedTitle);
  });

  it('should show the continue button text', () => {
    const understoodButton: HTMLElement = de.queryAll(By.directive(ButtonComponent))[0].nativeElement;
    expect(understoodButton.textContent).toEqual($localize`:@@web_authorize_paypal_continue:Continue`);
  });

  it('should show the cancel button text', () => {
    const understoodButton: HTMLElement = de.queryAll(By.directive(ButtonComponent))[1].nativeElement;
    expect(understoodButton.textContent).toEqual($localize`:@@web_authorize_paypal_cancel:Cancel`);
  });

  describe('and we click on the confirm button', () => {
    beforeEach(() => {
      spyOn(component, 'closeCallback');

      de.queryAll(By.directive(ButtonComponent))[0].nativeElement.click();
    });

    it('should close the modal once', () => {
      expect(component.closeCallback).toHaveBeenCalledTimes(1);
    });

    it('should close the modal with confirm value', () => {
      expect(component.closeCallback).toHaveBeenCalledWith(CONTINUE_TO_PAYPAL_CLOSURE_REASON.CONTINUE);
    });
  });

  describe('and we click on the cancel button', () => {
    beforeEach(() => {
      spyOn(component, 'closeCallback');

      de.queryAll(By.directive(ButtonComponent))[1].nativeElement.click();
    });

    it('should close the modal once', () => {
      expect(component.closeCallback).toHaveBeenCalledTimes(1);
    });

    it('should close the modal with confirm value', () => {
      expect(component.closeCallback).toHaveBeenCalledWith(CONTINUE_TO_PAYPAL_CLOSURE_REASON.CANCEL);
    });
  });
});
