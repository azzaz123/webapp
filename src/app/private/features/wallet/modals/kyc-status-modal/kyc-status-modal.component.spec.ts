import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  MOCK_KYC_MODAL_ERROR_PROPERTIES,
  MOCK_KYC_MODAL_SUCCEED_PROPERTIES,
} from '@fixtures/private/wallet/kyc/kyc-modal-properties.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { KYCStatusComponent } from '../kyc/components/kyc-status/kyc-status.component';

import { KYCStatusModalComponent } from './kyc-status-modal.component';

describe('KYCStatusModalComponent', () => {
  let component: KYCStatusModalComponent;
  let fixture: ComponentFixture<KYCStatusModalComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KYCStatusModalComponent, SvgIconComponent, KYCStatusComponent, ButtonComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusModalComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we click on the cross button...', () => {
    beforeEach(() => {
      spyOn(component.activeModal, 'close');

      fixture.debugElement.query(By.css('.KYCStatusModal__cross')).nativeElement.click();
    });

    it('should close the modal', () => {
      shouldCloseTheModal();
    });
  });

  describe('when we click on the CTA button...', () => {
    beforeEach(() => {
      spyOn(component.activeModal, 'close');
      spyOn(router, 'navigate');
    });

    describe('and the KYC status is an error', () => {
      beforeEach(() => {
        component.properties = MOCK_KYC_MODAL_ERROR_PROPERTIES;
        fixture.detectChanges();

        const kycStatusComponent = fixture.debugElement.query(By.directive(KYCStatusComponent));
        kycStatusComponent.triggerEventHandler('buttonClick', {});
      });

      it('should redirect to the KYC page to do the progress again', () => {
        const expectedURL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}/${WALLET_PATHS.KYC}`;

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedURL]);
      });

      it('should close the modal', () => {
        shouldCloseTheModal();
      });
    });

    describe('and the KYC status is NOT an error', () => {
      beforeEach(() => {
        component.properties = MOCK_KYC_MODAL_SUCCEED_PROPERTIES;
        fixture.detectChanges();

        const kycStatusComponent = fixture.debugElement.query(By.directive(KYCStatusComponent));
        kycStatusComponent.triggerEventHandler('buttonClick', {});
      });

      it('should stay at the same page', () => {
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should close the modal', () => {
        shouldCloseTheModal();
      });
    });
  });

  function shouldCloseTheModal(): void {
    expect(component.activeModal.close).toHaveBeenCalledTimes(1);
  }
});
