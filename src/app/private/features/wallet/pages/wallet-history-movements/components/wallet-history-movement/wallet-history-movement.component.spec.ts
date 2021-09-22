import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import {
  MOCK_MOVEMENT_HISTORY_DETAIL_SALE,
  MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT,
  MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT_WITH_ESTIMATED_PAYOUT,
} from '@api/fixtures/core/model/wallet/history/movement-history-detail.fixtures.spec';

import { WalletHistoryMovementComponent } from './wallet-history-movement.component';

@Component({
  selector: 'tsl-test-wrapper-wallet-history-movement',
  template: '<tsl-wallet-history-movement [walletMovementHistoryDetail]="walletMovementHistoryDetail"></tsl-wallet-history-movement>',
})
export class TestWrapperWalletHistoryMovementComponent {
  @Input() walletMovementHistoryDetail: WalletMovementHistoryDetail;
}

describe('WalletHistoryMovementComponent', () => {
  let wrapperComponent: TestWrapperWalletHistoryMovementComponent;
  let fixture: ComponentFixture<TestWrapperWalletHistoryMovementComponent>;

  const imageSelector = '.WalletHistoryMovement__image > img';
  const titleSelector = '.WalletHistoryMovement__text__title > div';
  const moneyAmountSelector = '.WalletHistoryMovement__text__title__money-amount';
  const descriptionSelector = '.WalletHistoryMovement__text__description';
  const estimatedPayoutDescriptionSelector = '.WalletHistoryMovement__text__estimatedPayoutDescription';
  const iconSelector = 'tsl-svg-icon';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletHistoryMovementComponent, TestWrapperWalletHistoryMovementComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperWalletHistoryMovementComponent);
    wrapperComponent = fixture.componentInstance;
    wrapperComponent.walletMovementHistoryDetail = MOCK_MOVEMENT_HISTORY_DETAIL_SALE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  describe('when rendering the component', () => {
    it('should show the image', () => {
      const imageElement = fixture.debugElement.query(By.css(imageSelector));
      const imageUrl = imageElement.attributes['src'];
      const expectedImageUrl = MOCK_MOVEMENT_HISTORY_DETAIL_SALE.imageUrl;

      expect(imageUrl).toEqual(expectedImageUrl);
    });

    it('should show the title', () => {
      const titleElement = fixture.debugElement.query(By.css(titleSelector));
      const title = titleElement.nativeElement.innerHTML;
      const expectedTitle = MOCK_MOVEMENT_HISTORY_DETAIL_SALE.title;

      expect(title).toEqual(expectedTitle);
    });

    it('should show the amount of money', () => {
      const moneyAmountElement = fixture.debugElement.query(By.css(moneyAmountSelector));
      const moneyAmount = moneyAmountElement.nativeElement.innerHTML;
      const expectedMoneyAmount = MOCK_MOVEMENT_HISTORY_DETAIL_SALE.moneyAmmount.toString();

      expect(moneyAmount).toEqual(expectedMoneyAmount);
    });

    it('should show the description', () => {
      const descriptionElement = fixture.debugElement.query(By.css(descriptionSelector));
      const description = descriptionElement.nativeElement.innerHTML.trim();
      const expectedDescription = MOCK_MOVEMENT_HISTORY_DETAIL_SALE.description;

      expect(description).toEqual(expectedDescription);
    });

    describe('and when money flow is type in', () => {
      beforeEach(() => {
        wrapperComponent.walletMovementHistoryDetail = MOCK_MOVEMENT_HISTORY_DETAIL_SALE;
        fixture.detectChanges();
      });

      it('should display the in type icon', () => {
        const iconElement = fixture.debugElement.query(By.css(iconSelector));
        const iconUrl = iconElement.nativeNode.src;
        const expectedIconUrl = 'assets/icons/money-in.svg';

        expect(iconUrl).toEqual(expectedIconUrl);
      });
    });

    describe('and when money flow is type out', () => {
      beforeEach(() => {
        wrapperComponent.walletMovementHistoryDetail = MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT;
        fixture.detectChanges();
      });

      it('should display the out type icon', () => {
        const iconElement = fixture.debugElement.query(By.css(iconSelector));
        const iconUrl = iconElement.nativeNode.src;
        const expectedIconUrl = 'assets/icons/money-out.svg';

        expect(iconUrl).toEqual(expectedIconUrl);
      });
    });

    describe('and when movement has estimated payout description', () => {
      beforeEach(() => {
        wrapperComponent.walletMovementHistoryDetail = MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT_WITH_ESTIMATED_PAYOUT;
        fixture.detectChanges();
      });

      it('should show the estimated payout description', () => {
        const estimatedPayoutDescriptionElement = fixture.debugElement.query(By.css(estimatedPayoutDescriptionSelector));
        const estimatedPayoutDescription = estimatedPayoutDescriptionElement.nativeElement.innerHTML.trim();
        const expectedEstimatedPayoutDescription = MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT_WITH_ESTIMATED_PAYOUT.estimatedPayoutDescription;

        expect(estimatedPayoutDescription).toEqual(expectedEstimatedPayoutDescription);
      });
    });

    describe('and when movement does NOT have estimated payout description', () => {
      it('should NOT show the estimated payout description', () => {
        const estimatedPayoutDescriptionElement = fixture.debugElement.query(By.css(estimatedPayoutDescriptionSelector));

        expect(estimatedPayoutDescriptionElement).toBeFalsy();
      });
    });
  });
});
