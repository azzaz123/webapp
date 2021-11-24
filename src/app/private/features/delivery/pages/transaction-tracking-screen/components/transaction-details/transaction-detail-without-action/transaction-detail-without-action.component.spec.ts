import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

import { TransactionDetailWithoutActionComponent } from './transaction-detail-without-action.component';

describe('TransactionDetailWithoutActionComponent', () => {
  let component: TransactionDetailWithoutActionComponent;
  let fixture: ComponentFixture<TransactionDetailWithoutActionComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BypassHTMLModule, ImageFallbackModule],
      declarations: [TransactionDetailWithoutActionComponent, TransactionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailWithoutActionComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.transactionDetail = MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION;
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
      expect(description).toEqual(MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION.description);
    });
  });
});
