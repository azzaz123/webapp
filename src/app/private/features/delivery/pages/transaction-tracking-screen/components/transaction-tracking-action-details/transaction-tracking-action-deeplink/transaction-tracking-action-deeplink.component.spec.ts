import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';

import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';

describe('TransactionTrackingActionDeeplinkComponent', () => {
  let component: TransactionTrackingActionDeeplinkComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDeeplinkComponent>;
  let de: DebugElement;
  let deeplinkService: DeeplinkService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailRouteModule, UserProfileRouteModule, ImageFallbackModule],
      declarations: [TransactionTrackingActionDeeplinkComponent],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
        {
          provide: ToastService,
          useClass: MockToastService,
        },
        {
          provide: DeeplinkService,
          useValue: {
            isAvailable() {},
            navigate() {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionDeeplinkComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.deeplinkAction = MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK;
    toastService = TestBed.inject(ToastService);
    deeplinkService = TestBed.inject(DeeplinkService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have an action...', () => {
    let anchor: DebugElement;

    beforeEach(() => {
      anchor = de.query(By.css('a'));
    });

    it('should wrap the content inside an anchor', () => {
      expect(anchor).toBeTruthy();
    });

    describe('and we click on the anchor', () => {
      beforeEach(() => {
        spyOn(deeplinkService, 'navigate');
      });

      describe('and the deeplink is available', () => {
        beforeEach(() => {
          spyOn(deeplinkService, 'isAvailable').and.returnValue(true);

          anchor.nativeElement.click();
        });

        describe('and we click on the link', () => {
          it('should navigate to the new section', () => {
            expect(deeplinkService.navigate).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('and the deeplink is NOT available', () => {
        beforeEach(() => {
          spyOn(toastService, 'show');
          spyOn(deeplinkService, 'isAvailable').and.returnValue(false);

          anchor.nativeElement.click();
        });

        it('should NOT navigate to a new section', () => {
          expect(deeplinkService.navigate).not.toHaveBeenCalled();
        });

        it('should show an error toast', () => {
          expect(toastService.show).toHaveBeenCalledWith({
            title: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_title_web_specific:Feature not available`,
            text: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_description_web_specific:We are working on it... We appreciate your patience!`,
            type: TOAST_TYPES.ERROR,
          });
        });
      });
    });
  });
});
