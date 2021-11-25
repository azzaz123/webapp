import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_TRANSACTION_DETAIL_DEEPLINK } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

import { TransactionDetailRedirectionComponent } from './transaction-detail-redirection.component';

describe('TransactionDetailRedirectionComponent', () => {
  let component: TransactionDetailRedirectionComponent;
  let fixture: ComponentFixture<TransactionDetailRedirectionComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTrackingDeeplinkModule, ItemDetailRouteModule, UserProfileRouteModule, BypassHTMLModule, ImageFallbackModule],
      declarations: [TransactionDetailRedirectionComponent, TransactionDetailComponent],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailRedirectionComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.transactionDetail = MOCK_TRANSACTION_DETAIL_DEEPLINK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when receiving the transaction detail', () => {
    it('should show the transaction detail', () => {
      expect(de.query(By.directive(TransactionDetailComponent))).toBeTruthy();
    });

    it('should have the description bypassed inside the transaction detail', () => {
      const description = de.query(By.css('#transactionDetailContentWrapper')).nativeElement.innerHTML;
      expect(description).toEqual(MOCK_TRANSACTION_DETAIL_DEEPLINK.description);
    });

    describe('and we click on the anchor wrapper', () => {
      describe('and the url is available', () => {
        it('should redirect to the user', () => {});
      });

      describe('and the url is available', () => {
        it('should NOT redirect to the user', () => {});

        it('should show a warning alert', () => {});
      });
    });
  });
});
