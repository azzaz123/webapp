import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import {
  MOCK_WALLET_MOVEMENTS_HISTORY_LIST,
  MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE,
  MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE,
} from '@api/fixtures/core/model/wallet/history/wallet-movements-history-list.fixtures.spec';
import { TabComponent } from '@shared/tabs-bar/components/tab/tab.component';
import { TabsBarComponent } from '@shared/tabs-bar/components/tabs-bar/tabs-bar.component';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { of } from 'rxjs';
import { WalletHistoryMovementComponent } from './components/wallet-history-movement/wallet-history-movement.component';

import { WalletHistoryMovementsComponent } from './wallet-history-movements.component';
import { WalletHistoryMovementsModule } from './wallet-history-movements.module';

describe('WalletHistoryMovementsComponent', () => {
  let component: WalletHistoryMovementsComponent;
  let fixture: ComponentFixture<WalletHistoryMovementsComponent>;
  let walletBalanceHistoryService: WalletBalanceHistoryService;

  const spinnerSelector = '.spinner';
  const componentWrapperSelector = '.WalletHistoryMovements';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletHistoryMovementsModule, HttpClientTestingModule, TabsBarModule],
      declarations: [WalletHistoryMovementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHistoryMovementsComponent);
    component = fixture.componentInstance;
    walletBalanceHistoryService = TestBed.inject(WalletBalanceHistoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all filters', () => {
    const tabsDebugElements = fixture.debugElement.queryAll(By.directive(TabComponent));
    const expectedNumberOfFilters = Object.values(WALLET_HISTORY_FILTERS).filter((v) => typeof v === 'string').length;
    const findTabBarComponentByElement = (de: DebugElement, tabBarElement: TabsBarElement<WALLET_HISTORY_FILTERS>) => {
      const tabBarComponentInstance: TabComponent<WALLET_HISTORY_FILTERS> = de.componentInstance;
      return tabBarComponentInstance.tabsBarElement.label === tabBarElement.label;
    };
    const expectAllFiltersToHaveATab = () => {
      component.tabBarElements.forEach((tabBarElement) => {
        const foundTabBar = tabsDebugElements.find((de) => findTabBarComponentByElement(de, tabBarElement));
        expect(foundTabBar).toBeTruthy();
      });
    };

    expect(tabsDebugElements.length).toEqual(expectedNumberOfFilters);
    expectAllFiltersToHaveATab();
  });

  describe('while waiting for server to respon', () => {
    it('should show a loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeTruthy();
    });
  });

  describe('when server respons with valid answer', () => {
    let walletBalanceGetSpy: jasmine.Spy;

    beforeEach(fakeAsync(() => {
      walletBalanceGetSpy = spyOn(walletBalanceHistoryService, 'get').and.returnValues(
        of(MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE),
        of(MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE)
      );
      component.ngOnInit();
      tick();
      fixture.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });

    it('should show as many movements as web context mapped from server', () => {
      const historyDetailsDebugElements = fixture.debugElement.queryAll(By.directive(WalletHistoryMovementComponent));

      expect(historyDetailsDebugElements.length).toBe(MOCK_WALLET_MOVEMENTS_HISTORY_LIST.list.length);
    });

    describe('and when user clicks on a filter', () => {
      it('should ask server for filtered movements', () => {
        walletBalanceGetSpy.calls.reset();
        const filtersDebugElement2 = fixture.debugElement.query(By.directive(TabsBarComponent));

        filtersDebugElement2.triggerEventHandler(
          'onChange',
          component.tabBarElements.find((te) => te.value === WALLET_HISTORY_FILTERS.IN)
        );

        expect(walletBalanceHistoryService.get).toHaveBeenCalledTimes(1);
        expect(walletBalanceHistoryService.get).toHaveBeenCalledWith(0, WALLET_HISTORY_FILTERS.IN);
      });
    });

    describe('and when user scrolls', () => {
      let componentWrapper: DebugElement;

      beforeEach(() => {
        componentWrapper = fixture.debugElement.query(By.css(componentWrapperSelector));
        componentWrapper.triggerEventHandler('scrolled', {});
        fixture.detectChanges();
      });

      it('should ask for next page', () => {
        expect(walletBalanceHistoryService.get).toHaveBeenCalledWith(
          MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE.paginationParameter,
          WALLET_HISTORY_FILTERS.ALL
        );
      });

      it('should add extra movements to the browser', () => {
        const walletMovements = fixture.debugElement.queryAll(By.directive(WalletHistoryMovementComponent));
        const movementsComponentsLength = walletMovements.length;
        const expectedLength =
          MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE.list.length + MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE.list.length;

        expect(movementsComponentsLength).toEqual(expectedLength);
      });

      describe('and when user scrolls more but there are no more pages', () => {
        beforeEach(() => walletBalanceGetSpy.calls.reset());

        it('should not ask for extra movements', () => {
          componentWrapper.triggerEventHandler('scrolled', {});

          expect(walletBalanceHistoryService.get).not.toHaveBeenCalled();
        });
      });
    });
  });
});
