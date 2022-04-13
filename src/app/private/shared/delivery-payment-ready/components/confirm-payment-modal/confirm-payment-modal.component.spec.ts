import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPaymentModalComponent } from './confirm-payment-modal.component';
import { DebugElement } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('ConfirmPaymentModalComponent', () => {
  let component: ConfirmPaymentModalComponent;
  let fixture: ComponentFixture<ConfirmPaymentModalComponent>;
  let de: DebugElement;
  let activeModal: NgbActiveModal;

  const confirmPaymentModalSelector: string = '.ConfirmPaymentModal__';
  const popOnboardBuyImageSelector: string = `${confirmPaymentModalSelector}image`;
  const titleSelector: string = `${confirmPaymentModalSelector}title`;
  const descriptionSelector: string = `${confirmPaymentModalSelector}description`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmPaymentModalComponent, ButtonComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPaymentModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the pop onboard buy image', () => {
    const imageSource: string = fixture.debugElement.nativeElement.querySelector(popOnboardBuyImageSelector).src;

    expect(popOnboardBuyImageSelector).toBeTruthy();
    expect(imageSource).toContain('assets/images/confirm-payment-modal/pop-onboard-buy.svg');
  });

  it('should show the information title', () => {
    const title: string = de.query(By.css(titleSelector)).nativeElement.innerHTML;
    const expectedTitle = $localize`:@@pay_view_buyer_modal_3ds_confirm_payment_title:Safer payments`;

    expect(title).toBe(expectedTitle);
  });

  it('should show the description message', () => {
    const title: string = de.query(By.css(descriptionSelector)).nativeElement.innerHTML;
    const expectedTitle = $localize`:pay_view_buyer_modal_3ds_confirm_payment_description:To make sure your payments are secure, we sometimes ask you to confirm them through your bank. It's a simple process!`;

    expect(title).toBe(expectedTitle);
  });

  it('should show the button text', () => {
    const understoodButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
    expect(understoodButton.textContent).toEqual($localize`:@@pay_view_buyer_modal_3ds_confirm_payment_confirm_button:Understood`);
  });

  describe('and we click on the button', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
      de.query(By.directive(ButtonComponent)).nativeElement.click();
    });

    it('should close the modal', () => {
      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });
  });
});
