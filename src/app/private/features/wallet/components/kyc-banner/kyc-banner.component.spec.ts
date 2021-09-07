import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BannerComponent } from '@shared/banner/banner.component';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYCInfoModalComponent } from '../../modals/kyc-info-modal/kyc-info-modal.component';
import { KYC_BANNER_TYPES } from '@api/core/model/kyc-properties/constants/kyc-banner-constants';
import { KYCBannerComponent } from './kyc-banner.component';
import { KYCStatusModalComponent } from '../../modals/kyc-status-modal/kyc-status-modal.component';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import {
  MOCK_ERROR_BANNER_PROPERTIES,
  MOCK_IN_PROGRESS_BANNER_PROPERTIES,
  MOCK_KYC_BANNER_PENDING,
  MOCK_KYC_BANNER_PENDING_VERIFICATION,
  MOCK_KYC_BANNER_REJECTED,
  MOCK_KYC_BANNER_VERIFIED,
  MOCK_SUCCEED_BANNER_PROPERTIES,
} from '@fixtures/private/wallet/kyc/kyc-banner.fixtures.spec';
import { MOCK_KYC_ERROR_PROPERTIES } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';

describe('KYCBannerComponent', () => {
  const componentInstance: any = {};
  let fixture: ComponentFixture<KYCBannerComponent>;
  let component: KYCBannerComponent;
  let debugElement: DebugElement;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCBannerComponent, BannerComponent, SvgIconComponent],
      imports: [SvgIconModule, ButtonModule, HttpClientTestingModule, BannerModule],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: componentInstance,
                result: Promise.resolve(),
              };
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCBannerComponent);
    modalService = TestBed.inject(NgbModal);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('when we do not specify the banner specifications...', () => {
    beforeEach(() => {
      component.KYCBannerSpecifications = null;

      fixture.detectChanges();
    });

    it('should not show the kyc banner', () => {
      const banner = debugElement.query(By.directive(BannerComponent));

      expect(banner).toBeFalsy();
    });
  });

  describe('when we specify the KYC banner specifications', () => {
    it('should show the kyc banner', () => {
      setBannerSpecifications(MOCK_KYC_BANNER_PENDING);

      const banner = debugElement.query(By.directive(BannerComponent));

      expect(banner).toBeTruthy();
    });

    it('should get the correct alert specifications', () => {
      setBannerSpecifications(MOCK_KYC_BANNER_PENDING);

      expect(component.ngbAlertConfiguration).toStrictEqual({
        dismissible: KYC_BANNER_TYPES[0].dismissible,
        type: KYC_BANNER_TYPES[0].type,
      });
    });

    it('should show the svg', () => {
      setBannerSpecifications(MOCK_KYC_BANNER_PENDING);

      const icon = debugElement.query(By.directive(SvgIconComponent));

      expect(icon).toBeTruthy();
      expect(icon.componentInstance.src).toBe(KYC_BANNER_TYPES[0].svgPath);
    });

    it('should show the specified button text', () => {
      setBannerSpecifications(MOCK_KYC_BANNER_PENDING);

      const button: HTMLElement = debugElement.query(By.directive(ButtonComponent)).nativeElement;

      expect(button.textContent).toEqual(component.KYCBannerSpecifications.buttonText);
    });

    describe('and we click on the button...', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();
      });

      describe('and the status of the banner is pending', () => {
        beforeEach(() => {
          setBannerSpecifications(MOCK_KYC_BANNER_PENDING);
        });

        it('should open the KYC process modal', fakeAsync(() => {
          debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
          tick();

          expect(modalService.open).toHaveBeenCalledWith(KYCInfoModalComponent);
        }));
      });

      describe('and the status of the banner is NOT pending', () => {
        describe('and the status is pending verification', () => {
          beforeEach(() => {
            setBannerSpecifications(MOCK_KYC_BANNER_PENDING_VERIFICATION);

            debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
          });

          it('should open the KYC informative status modal', fakeAsync(() => {
            tick();

            expect(modalService.open).toHaveBeenCalledWith(KYCStatusModalComponent);
          }));

          it('should set the modal in progress verification properties in the modal', fakeAsync(() => {
            tick();

            expect(componentInstance.properties).toEqual(MOCK_IN_PROGRESS_BANNER_PROPERTIES);
          }));
        });

        describe('and the status is verified', () => {
          beforeEach(() => {
            setBannerSpecifications(MOCK_KYC_BANNER_VERIFIED);

            debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
          });

          it('should open the KYC informative status modal', fakeAsync(() => {
            tick();

            expect(modalService.open).toHaveBeenCalledWith(KYCStatusModalComponent);
          }));

          it('should set the modal succeed properties in the modal', fakeAsync(() => {
            tick();

            expect(componentInstance.properties).toEqual(MOCK_SUCCEED_BANNER_PROPERTIES);
          }));
        });

        describe('and the status is rejected', () => {
          beforeEach(() => {
            component.KYCProperties = MOCK_KYC_ERROR_PROPERTIES;
            setBannerSpecifications(MOCK_KYC_BANNER_REJECTED);

            debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
          });

          it('should open the KYC informative status modal', fakeAsync(() => {
            tick();

            expect(modalService.open).toHaveBeenCalledWith(KYCStatusModalComponent);
          }));

          it('should set the modal rejected properties in the modal', fakeAsync(() => {
            tick();

            expect(componentInstance.properties).toEqual({
              ...MOCK_ERROR_BANNER_PROPERTIES,
              description: MOCK_KYC_ERROR_PROPERTIES.refusedReason.translation,
            });
          }));
        });
      });
    });
  });

  function setBannerSpecifications(BannerType: KYCBannerSpecifications): void {
    component.KYCBannerSpecifications = BannerType;

    fixture.detectChanges();
  }
});
