import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';

import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';

describe('TransactionTrackingActionDeeplinkComponent', () => {
  let component: TransactionTrackingActionDeeplinkComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDeeplinkComponent>;
  let de: DebugElement;
  let deeplinkService: DeeplinkService;

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
          spyOn(window, 'alert');
          spyOn(deeplinkService, 'isAvailable').and.returnValue(false);

          anchor.nativeElement.click();
        });

        it('should NOT navigate to a new section', () => {
          expect(deeplinkService.navigate).not.toHaveBeenCalled();
        });

        it('should show a warning alert', () => {
          expect(window.alert).toHaveBeenCalledWith('This deeplink is not available');
        });
      });
    });
  });
});
