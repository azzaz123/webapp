import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { VERIFICATIONS_N_SECURITY_TYPES } from '../../verifications-n-security.component';

import { VerificationCardComponent } from './verification-card.component';

describe('VerificationCardComponent', () => {
  let component: VerificationCardComponent;
  let fixture: ComponentFixture<VerificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationCardComponent, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when it has a verified email', () => {
    beforeEach(() => {
      component.isVerified = true;
      component.title = 'email';
      component.textButton = 'change';
      fixture.detectChanges();
    });

    it('should show the status verified', () => {
      const card = fixture.debugElement.query(By.css('.VerificationCard__verified'));

      expect(card).toBeTruthy();
    });

    it('should show the change button', () => {
      const changeButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      expect(changeButton.textContent).toContain(component.textButton);
    });

    it('should show the change button with secondary styles', () => {
      const secondayButton = fixture.debugElement.query(By.css('.btn-secondary'));

      expect(secondayButton).toBeTruthy();
    });

    describe('and click on button', () => {
      it('should emit the click event', () => {
        spyOn(component.buttonClick, 'emit');

        const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        ctaButton.click();

        expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);
        expect(component.buttonClick.emit).toHaveBeenLastCalledWith();
      });
    });
  });

  describe('when it has a not verified email', () => {
    beforeEach(() => {
      component.isVerified = false;
      component.title = 'email';
      component.textButton = 'verify';
      component.footerLegend = 'test@wallapop.com';
      fixture.detectChanges();
    });

    it('should show the status not verified', () => {
      const card = fixture.debugElement.query(By.css('.VerificationCard__verified'));

      expect(card).toBeFalsy();
    });

    it('should show the verify button with primary styles', () => {
      const secondayButton = fixture.debugElement.query(By.css('.btn-primary'));

      expect(secondayButton).toBeTruthy();
    });

    it('should show the user email at the footer', () => {
      const footerLegend: HTMLElement = fixture.debugElement.query(By.css('.VerificationCard__footer')).nativeElement;

      expect(footerLegend.textContent).toContain(component.footerLegend);
    });
  });
});
