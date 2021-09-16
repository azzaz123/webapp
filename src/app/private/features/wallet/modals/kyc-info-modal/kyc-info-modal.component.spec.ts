import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { KYCTrackingEventsService } from '../kyc/services/kyc-tracking-events/kyc-tracking-events.service';

import { KYCInfoModalComponent } from './kyc-info-modal.component';

describe('KYCInfoModalComponent', () => {
  const FIRST_SLIDE = 'ngb-slide-0';
  const continueButtonSelector = '#continueButton';
  const verifyButtonSelector = '#verifyButton';

  let component: KYCInfoModalComponent;
  let fixture: ComponentFixture<KYCInfoModalComponent>;
  let de: DebugElement;
  let activeModal: NgbActiveModal;
  let router: Router;
  let kycTrackingEventsService: KYCTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SlidesCarouselModule],
      declarations: [KYCInfoModalComponent, SvgIconComponent, ButtonComponent],
      providers: [
        NgbActiveModal,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        {
          provide: KYCTrackingEventsService,
          useValue: {
            trackViewKYCTutorialScreen() {},
            trackClickKYCStartVerification() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCInfoModalComponent);
    de = fixture.debugElement;
    activeModal = TestBed.inject(NgbActiveModal);
    router = TestBed.inject(Router);
    kycTrackingEventsService = TestBed.inject(KYCTrackingEventsService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component opens...', () => {
    it('should ask to the KYC analytics service to track the page view event', () => {
      spyOn(kycTrackingEventsService, 'trackViewKYCTutorialScreen');

      fixture.detectChanges();

      expect(kycTrackingEventsService.trackViewKYCTutorialScreen).toHaveBeenCalledTimes(1);
    });
  });

  describe('when we click on the cross...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should close the modal', () => {
      spyOn(activeModal, 'close');
      const cross = de.query(By.directive(SvgIconComponent)).nativeElement;

      cross.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('when we are NOT on the last slide...', () => {
    beforeEach(() => {
      jest.spyOn(component, 'currentSlide', 'get').mockReturnValue(FIRST_SLIDE);

      fixture.detectChanges();
    });

    describe('the continue button...', () => {
      it('should be visible', () => {
        const continueButton = de.query(By.css(continueButtonSelector));

        expect(continueButton).toBeTruthy();
      });

      it('should swipe to the right when we click', () => {
        spyOn(component.slidesCarousel.carousel, 'next');
        const continueButton = de.query(By.css(continueButtonSelector)).nativeElement;

        continueButton.click();

        expect(component.slidesCarousel.carousel.next).toHaveBeenCalledTimes(1);
      });
    });

    describe('the verify identity button...', () => {
      it('should NOT be visible', () => {
        const verifyButton = de.query(By.css(verifyButtonSelector));

        expect(verifyButton).toBeFalsy();
      });
    });
  });

  describe('when we are on the last slide...', () => {
    beforeEach(() => {
      jest.spyOn(component, 'currentSlide', 'get').mockReturnValue(component.LAST_SLIDE);

      fixture.detectChanges();
    });

    describe('the continue button...', () => {
      it('should NOT be visible', () => {
        const continueButton = de.query(By.css(continueButtonSelector));

        expect(continueButton).toBeFalsy();
      });
    });

    describe('the verify identity button...', () => {
      it('should be visible', () => {
        const verifyButton = de.query(By.css(verifyButtonSelector));

        expect(verifyButton).toBeTruthy();
      });

      describe('and we click the button...', () => {
        beforeEach(() => {
          spyOn(kycTrackingEventsService, 'trackClickKYCStartVerification');
          spyOn(router, 'navigate');
          spyOn(activeModal, 'close');

          const verifyButton = de.query(By.css(verifyButtonSelector)).nativeElement;
          verifyButton.click();

          it('should ask to the KYC analytics service to track the click event', () => {
            expect(kycTrackingEventsService.trackViewKYCTutorialScreen).toHaveBeenCalledTimes(1);
          });

          it('should navigate to the KYC page', () => {
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([component.KYC_LINK]);
          });

          it('should close the modal', () => {
            expect(activeModal.close).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
