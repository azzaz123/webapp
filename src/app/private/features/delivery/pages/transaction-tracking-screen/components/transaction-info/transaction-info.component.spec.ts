import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_INFO } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-info.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

import { TransactionInfoComponent } from './transaction-info.component';

describe('TransactionInfoComponent', () => {
  let component: TransactionInfoComponent;
  let fixture: ComponentFixture<TransactionInfoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionInfoComponent],
      imports: [ImageFallbackModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive transaction info...', () => {
    beforeEach(() => {
      component.transactionInfo = MOCK_TRANSACTION_INFO;
      fixture.detectChanges();
    });

    describe('and the item image is defined...', () => {
      it('should show the provided item image src', () => {
        expect(de.nativeElement.querySelector(`[src*="${MOCK_TRANSACTION_INFO.item.imageSrc}"]`)).toBeTruthy();
      });

      it('should apply the provided style', () => {
        checkIfStyleIsInTemplate(`.TrackingInfo__image--${MOCK_TRANSACTION_INFO.item.className}`, true);
      });
    });

    describe('and the user image is defined...', () => {
      it('should show the provided user image src', () => {
        expect(de.nativeElement.querySelector(`[src*="${MOCK_TRANSACTION_INFO.user.imageSrc}"]`)).toBeTruthy();
      });

      it('should apply the provided style', () => {
        checkIfStyleIsInTemplate(`.TrackingInfo__image--${MOCK_TRANSACTION_INFO.user.className}`, true);
      });
    });

    it('should show the provided item name', () => {
      const itemPrice: HTMLElement = de.query(By.css('#itemName')).nativeElement.innerHTML;

      expect(itemPrice).toEqual(MOCK_TRANSACTION_INFO.item.name);
    });

    it('should show the provided item price', () => {
      const itemPrice: HTMLElement = de.query(By.css('.TrackingInfo__itemInfo__price')).nativeElement.innerHTML;

      expect(itemPrice).toEqual(MOCK_TRANSACTION_INFO.item.price);
    });
  });

  describe('when we NOT receive transaction info...', () => {
    beforeEach(() => {
      component.transactionInfo = null;
      fixture.detectChanges();
    });

    it('should NOT render the content', () => {
      checkIfStyleIsInTemplate(`.TrackingInfo`, false);
    });
  });

  function checkIfStyleIsInTemplate(selector: string, shouldBeInTemplate: boolean): void {
    const styles: DebugElement = de.query(By.css(selector));
    if (shouldBeInTemplate) {
      expect(styles).toBeTruthy();
    } else {
      expect(styles).toBeFalsy();
    }
  }
});
