import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { TransactionTrackingActionTrackingWebviewComponent } from './transaction-tracking-action-tracking-webview.component';

describe('TransactionTrackingActionTrackingWebviewComponent', () => {
  let component: TransactionTrackingActionTrackingWebviewComponent;
  let fixture: ComponentFixture<TransactionTrackingActionTrackingWebviewComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [TransactionTrackingActionTrackingWebviewComponent],
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
    fixture = TestBed.createComponent(TransactionTrackingActionTrackingWebviewComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.trackingWebviewAction = MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive an action...', () => {
    it('should wrap the content with an anchor', () => {
      const anchor = fixture.debugElement.query(By.css('a'));

      expect(anchor.attributes.href).toEqual(MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW.linkUrl);
      expect(anchor.attributes.target).toEqual('_blank');
    });
  });
});
