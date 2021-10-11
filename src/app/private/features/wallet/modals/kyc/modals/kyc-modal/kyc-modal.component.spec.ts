import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentImageIsInvalidError } from '@api/core/errors/payments/kyc';
import { KYCServicesModule } from '@api/payments/kyc/kyc-services.module';
import { KYCService } from '@api/payments/kyc/kyc.service';
import {
  MOCK_EMPTY_KYC_SPECIFICATIONS,
  MOCK_KYC_DOCUMENTATION,
  MOCK_KYC_NATIONALITY,
  MOCK_KYC_SPECIFICATIONS,
} from '@fixtures/private/wallet/kyc/kyc-specifications.fixtures.spec';
import { MOCK_KYC_IMAGES_BASE_64 } from '@fixtures/private/wallet/kyc/kyc-images.fixtures.spec';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { KYCModule } from '../../kyc.module';
import { KYCStoreService } from '../../services/kyc-store/kyc-store.service';

import { KYCModalComponent } from './kyc-modal.component';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';

const kycSpecificationsSubjectMock: BehaviorSubject<KYCSpecifications> = new BehaviorSubject<KYCSpecifications>(
  MOCK_EMPTY_KYC_SPECIFICATIONS
);

describe('KYCModalComponent', () => {
  const bankAccountSelector = 'tsl-bank-account';
  const KYCNationalitySelector = 'tsl-kyc-nationality';
  const KYCImageOptionsSelector = 'tsl-kyc-image-options';
  const KYCUploadImagesSelector = 'tsl-kyc-upload-images';
  const KYCStatusPropertiesSelector = 'tsl-kyc-status';

  let component: KYCModalComponent;
  let kycStoreService: KYCStoreService;
  let kycService: KYCService;
  let kycTrackingEventsService: KYCTrackingEventsService;
  let fixture: ComponentFixture<KYCModalComponent>;
  let activeModal: NgbActiveModal;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KYCModule, RouterTestingModule, HttpClientTestingModule, KYCServicesModule],
      declarations: [KYCModalComponent, StepperComponent, StepDirective],
      providers: [
        DeviceDetectorService,
        NgbActiveModal,
        KYCStoreService,
        ToastService,
        KYCTrackingEventsService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        ToastService,
        {
          provide: KYCStoreService,
          useValue: {
            set specifications(spec: KYCSpecifications) {
              kycSpecificationsSubjectMock.next(spec);
            },
            get specifications(): KYCSpecifications {
              return kycSpecificationsSubjectMock.getValue();
            },
            get specifications$(): Observable<KYCSpecifications> {
              return kycSpecificationsSubjectMock.asObservable();
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCModalComponent);
    component = fixture.componentInstance;
    kycStoreService = TestBed.inject(KYCStoreService);
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    kycService = TestBed.inject(KYCService);
    activeModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
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
          expect(component.stepper.goNext).toHaveBeenCalledTimes(1);
        });
      });

      describe('and we click on cross button...', () => {
        beforeEach(() => {
          spyOn(window, 'confirm').and.returnValue(true);
          spyOn(activeModal, 'close');
          const bankAccountComponent = fixture.debugElement.query(By.css(bankAccountSelector));

          bankAccountComponent.triggerEventHandler('closeModal', {});
        });

        it('should open popup confirmation close', () => {
          expect(window.confirm).toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
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

          expect(component.stepper.goBack).toHaveBeenCalledTimes(1);
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
            expect(component.stepper.goNext).toHaveBeenCalledTimes(1);
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
            expect(component.stepper.goNext).not.toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('and we click on cross button...', () => {
        beforeEach(() => {
          spyOn(window, 'confirm').and.returnValue(true);
          spyOn(activeModal, 'close');
          const KYCNationalityComponent = fixture.debugElement.query(By.css(KYCNationalitySelector));

          KYCNationalityComponent.triggerEventHandler('closeModal', {});
        });

        it('should open popup confirmation close', () => {
          expect(window.confirm).toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
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
          expect(component.stepper.goBack).toHaveBeenCalledTimes(1);
        });
      });

      describe('and we click on cross button...', () => {
        beforeEach(() => {
          spyOn(window, 'confirm').and.returnValue(true);
          spyOn(activeModal, 'close');
          const KYCImageOptionsComponent = fixture.debugElement.query(By.css(KYCImageOptionsSelector));

          KYCImageOptionsComponent.triggerEventHandler('closeModal', {});
        });

        it('should open popup confirmation close', () => {
          expect(window.confirm).toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('and we are on upload images step', () => {
      beforeEach(() => {
        kycStoreService.specifications = MOCK_KYC_SPECIFICATIONS;
        component.stepper.activeId = 3;
      });

      describe('and the verification ends...', () => {
        beforeEach(() => {
          spyOn(kycTrackingEventsService, 'trackClickKYCFinishIdentityVerification');
        });

        describe('and the verification request succeed', () => {
          beforeEach(() => {
            spyOn(kycService, 'request').and.returnValue(of(null));
            spyOn(component.stepper, 'goNext');

            fixture.detectChanges();

            const KYCUploadImagesComponent = fixture.debugElement.query(By.css(KYCUploadImagesSelector));
            KYCUploadImagesComponent.triggerEventHandler('endVerification', MOCK_KYC_IMAGES_BASE_64);
          });

          it('should do the kyc request ', () => {
            expect(kycService.request).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64);
            expect(kycService.request).toHaveBeenCalledTimes(1);
          });

          it('should update the specifications on the store', () => {
            expect(kycStoreService.specifications).toStrictEqual({
              ...kycStoreService.specifications,
              images: {
                frontSide: MOCK_KYC_IMAGES_BASE_64.frontSide,
                backSide: MOCK_KYC_IMAGES_BASE_64.backSide,
              },
            });
          });

          it('should go to the next step', () => {
            expect(component.stepper.goNext).toHaveBeenCalledTimes(1);
          });

          it('should request to the KYC analytics service to track the click event', () => {
            expect(kycTrackingEventsService.trackClickKYCFinishIdentityVerification).toHaveBeenCalledTimes(1);
            expect(kycTrackingEventsService.trackClickKYCFinishIdentityVerification).toHaveBeenCalledWith(
              MOCK_KYC_SPECIFICATIONS.documentation.analyticsName
            );
          });
        });

        describe('and the verification request fails', () => {
          beforeEach(() => {
            spyOn(kycService, 'request').and.returnValue(throwError(new DocumentImageIsInvalidError()));
            spyOn(component.stepper, 'goNext');
            spyOn(toastService, 'show');

            fixture.detectChanges();

            const KYCUploadImagesComponent = fixture.debugElement.query(By.css(KYCUploadImagesSelector));
            KYCUploadImagesComponent.triggerEventHandler('endVerification', MOCK_KYC_IMAGES_BASE_64);
          });

          it('should do the kyc request ', () => {
            expect(kycService.request).toHaveBeenCalledWith(MOCK_KYC_IMAGES_BASE_64);
            expect(kycService.request).toHaveBeenCalledTimes(1);
          });

          it('should NOT update the specifications on the store', () => {
            expect(kycStoreService.specifications).toStrictEqual(MOCK_KYC_SPECIFICATIONS);
          });

          it('should show an error toast', () => {
            const errorMessage = $localize`:@@kyc_failed_snackbar_unknown_error_web_specific:Oops! There was an error.`;
            expect(toastService.show).toHaveBeenCalledWith({ text: errorMessage, type: TOAST_TYPES.ERROR });
          });

          it('should NOT go to the next step', () => {
            expect(component.stepper.goNext).not.toHaveBeenCalledTimes(1);
          });

          it('should request to the KYC analytics service to track the click event', () => {
            expect(kycTrackingEventsService.trackClickKYCFinishIdentityVerification).toHaveBeenCalledTimes(1);
            expect(kycTrackingEventsService.trackClickKYCFinishIdentityVerification).toHaveBeenCalledWith(
              MOCK_KYC_SPECIFICATIONS.documentation.analyticsName
            );
          });
        });
      });

      describe('and we click on the back button...', () => {
        beforeEach(() => {
          spyOn(component.stepper, 'goBack');

          fixture.detectChanges();

          const KYCUploadImagesComponent = fixture.debugElement.query(By.css(KYCUploadImagesSelector));
          KYCUploadImagesComponent.triggerEventHandler('goBack', {});
        });

        it('should go back to the previous step', () => {
          expect(component.stepper.goBack).toHaveBeenCalledTimes(1);
        });
      });

      describe('and we click on cross button...', () => {
        beforeEach(() => {
          spyOn(window, 'confirm').and.returnValue(true);
          spyOn(activeModal, 'close');

          fixture.detectChanges();

          const KYCUploadImagesComponent = fixture.debugElement.query(By.css(KYCUploadImagesSelector));
          KYCUploadImagesComponent.triggerEventHandler('closeModal', {});
        });

        it('should open popup confirmation close', () => {
          expect(window.confirm).toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('and we are on in progress informative step', () => {
      beforeEach(() => {
        component.stepper.activeId = 4;

        fixture.detectChanges();
      });

      describe('and the user clicks on the OK button', () => {
        beforeEach(() => {
          spyOn(window, 'confirm');
          spyOn(activeModal, 'close');
          const KYCStatusPropertiesComponent = fixture.debugElement.query(By.css(KYCStatusPropertiesSelector));

          KYCStatusPropertiesComponent.triggerEventHandler('buttonClick', {});
        });

        it('should not trigger confirmation close', () => {
          expect(window.confirm).not.toHaveBeenCalled();
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
        });
      });

      describe('and we click on cross button...', () => {
        beforeEach(() => {
          spyOn(activeModal, 'close');
          spyOn(window, 'confirm');
          const KYCStatusPropertiesComponent = fixture.debugElement.query(By.css(KYCStatusPropertiesSelector));

          KYCStatusPropertiesComponent.triggerEventHandler('closeModal', {});
        });

        it('should not trigger confirmation close', () => {
          expect(window.confirm).not.toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('onDestroy', () => {
      beforeEach(() => {
        component.ngOnDestroy();
      });

      it('should reset all the specifications', () => {
        expect(kycStoreService.specifications).toStrictEqual(MOCK_EMPTY_KYC_SPECIFICATIONS);
      });
    });
  });
});
