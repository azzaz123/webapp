import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MOCK_KYC_DOCUMENTATION, MOCK_KYC_NATIONALITY } from '@fixtures/private/wallet/kyc/kyc-specifications.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { KYCModule } from '../../kyc.module';
import { KYCStoreService } from '../../services/kyc-store/kyc-store.service';

import { KYCModalComponent } from './kyc-modal.component';

describe('KYCModalComponent', () => {
  const bankAccountSelector = 'tsl-bank-account';
  const KYCNationalitySelector = 'tsl-kyc-nationality';
  const KYCImageOptionsSelector = 'tsl-kyc-image-options';

  let component: KYCModalComponent;
  let kycStoreService: KYCStoreService;
  let fixture: ComponentFixture<KYCModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KYCModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [KYCModalComponent, StepperComponent, StepDirective],
      providers: [DeviceDetectorService, NgbActiveModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCModalComponent);
    component = fixture.componentInstance;
    kycStoreService = TestBed.inject(KYCStoreService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when use the stepper...', () => {
    it('should apply the content style ', () => {
      const KYCContentStyle = fixture.debugElement.query(By.css('.KYCModal__content'));

      expect(KYCContentStyle).toBeTruthy();
    });

    describe('and we are on the bank account step...', () => {
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
        it('should go back to the previous step', () => {
          spyOn(component.stepper, 'goBack');

          const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));
          KYCNationalityComponent.triggerEventHandler('goBack', {});

          expect(component.stepper.goBack).toHaveBeenCalled();
        });
      });

      describe('and the nationality change...', () => {
        it('should update the nationality on the store specifications', () => {
          const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));
          KYCNationalityComponent.triggerEventHandler('nationalityChange', MOCK_KYC_NATIONALITY);

          expect(kycStoreService.specifications.nationality).toStrictEqual(MOCK_KYC_NATIONALITY);
        });
      });

      describe('and the documentation change...', () => {
        describe('and the documentation is defined...', () => {
          beforeEach(() => {
            spyOn(component.stepper, 'goNext');

            const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));
            KYCNationalityComponent.triggerEventHandler('documentToRequestChange', MOCK_KYC_DOCUMENTATION);
          });

          it('should update the documentation on the store specifications', () => {
            expect(kycStoreService.specifications.documentation).toStrictEqual(MOCK_KYC_DOCUMENTATION);
          });

          it('should go to the next step', () => {
            expect(component.stepper.goNext).toHaveBeenCalled();
          });
        });

        describe('and the documentation is NOT defined...', () => {
          beforeEach(() => {
            spyOn(component.stepper, 'goNext');

            const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));
            KYCNationalityComponent.triggerEventHandler('documentToRequestChange', null);
          });

          it('should update the documentation on the store specifications', () => {
            expect(kycStoreService.specifications.documentation).toStrictEqual(null);
          });

          it('should stay on the same step', () => {
            expect(component.stepper.goNext).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('and we are on the define image method step', () => {
      beforeEach(() => {
        component.stepper.activeId = 2;

        fixture.detectChanges();
      });

      describe('and we click to go back button...', () => {
        beforeEach(() => {
          spyOn(component.stepper, 'goBack');
          const KYCImageOptionsComponent = fixture.debugElement.query(By.css(KYCImageOptionsSelector));

          KYCImageOptionsComponent.triggerEventHandler('goBack', {});
        });

        it('should go back to the previous step', () => {
          expect(component.stepper.goBack).toHaveBeenCalled();
        });
      });
    });
  });
});
