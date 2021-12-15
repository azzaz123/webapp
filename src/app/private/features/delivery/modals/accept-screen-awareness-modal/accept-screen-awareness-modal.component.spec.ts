import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { LottieComponent } from '@shared/lottie/lottie.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { AcceptScreenAwarenessModalComponent } from './accept-screen-awareness-modal.component';

describe('AcceptScreenAwarenessModalComponent', () => {
  let component: AcceptScreenAwarenessModalComponent;
  let fixture: ComponentFixture<AcceptScreenAwarenessModalComponent>;
  let de: DebugElement;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenAwarenessModalComponent, ButtonComponent, LottieComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenAwarenessModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    activeModal = TestBed.inject(NgbActiveModal);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the information title', () => {
    const title = de.query(By.css('.AcceptScreenAwarenessModal__title')).nativeElement.innerHTML;
    const expectedTitle = $localize`:@@trx_on_web_modal_title_web_specific:Wallapop Shipping on web!`;

    expect(title).toBe(expectedTitle);
  });

  it('should show the description message', () => {
    const description = de.query(By.css('#AcceptScreenAwarenessModalDescription')).nativeElement.innerHTML;
    const expectedDescription = $localize`:@@trx_on_web_modal_part1_description_web_specific:Soon our shipping service will be available on the web. That's why you can already check or edit your shipping data.`;

    expect(description).toBe(expectedDescription);
  });

  it('should show the lottie', () => {
    const lottie = de.query(By.directive(LottieComponent));

    expect(lottie).toBeTruthy();
    expect(lottie.componentInstance.src).toBe(component.ACCEPT_SCREEN_AWARENESS_LOTTIE);
  });

  it('should show the button text', () => {
    const understoodButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
    expect(understoodButton.textContent).toEqual($localize`:@@trx_on_web_modal_understood_button_web_specific:Understood`);
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
