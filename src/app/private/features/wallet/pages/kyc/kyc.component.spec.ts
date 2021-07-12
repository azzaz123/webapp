import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';

import { KycComponent } from './kyc.component';

describe('KycComponent', () => {
  let component: KycComponent;
  let fixture: ComponentFixture<KycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycComponent, StepperComponent, StepDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when use the stepper...', () => {
    describe('and the bank account save succeed', () => {
      beforeEach(() => {
        spyOn(component.stepper, 'goNext');
        const bankAccountComponent = fixture.debugElement.query(By.css('tsl-bank-account'));

        bankAccountComponent.triggerEventHandler('bankAccountSaved', {});
      });

      it('should go to the next step', () => {
        expect(component.stepper.goNext).toHaveBeenCalled();
      });
    });
  });
});
