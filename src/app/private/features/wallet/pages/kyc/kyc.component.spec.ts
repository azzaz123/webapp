import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { KYCComponent } from './kyc.component';
import { KYCModule } from './kyc.module';

describe('KYCComponent', () => {
  const bankAccountSelector = 'tsl-bank-account';
  const KYCNationalitySelector = 'tsl-kyc-nationality';

  let component: KYCComponent;
  let fixture: ComponentFixture<KYCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KYCModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [KYCComponent, StepperComponent, StepDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when use the stepper...', () => {
    describe('and we are on the first step...', () => {
      beforeEach(() => {
        component.stepper.activeId = 0;

        fixture.detectChanges();
      });

      describe('and the bank account save succeed', () => {
        beforeEach(() => {
          spyOn(component.stepper, 'goNext');
          const bankAccountComponent = fixture.debugElement.query(By.css(bankAccountSelector));

          bankAccountComponent.triggerEventHandler('bankAccountSaved', {});
        });

        it('should go to the next step', () => {
          expect(component.stepper.goNext).toHaveBeenCalled();
        });
      });
    });

    describe('and we are on the nationality step...', () => {
      beforeEach(() => {
        component.stepper.activeId = 1;

        fixture.detectChanges();
      });

      describe('and we click to go back button...', () => {
        beforeEach(() => {
          spyOn(component.stepper, 'goBack');
          const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));

          KYCNationalityComponent.triggerEventHandler('goBack', {});
        });

        it('should go back to the previous step', () => {
          expect(component.stepper.goBack).toHaveBeenCalled();
        });
      });

      describe('and we define the photos to request to the user...', () => {
        beforeEach(() => {
          spyOn(component.stepper, 'goNext');
          const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));

          KYCNationalityComponent.triggerEventHandler('imagesToRequestChange', 2);
        });

        it('should define the photos to request', () => {
          expect(component.imagesToRequest).toBe(2);
        });

        it('should go to the next step', () => {
          expect(component.stepper.goNext).toHaveBeenCalled();
        });
      });
    });
  });
});
