import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { HistoricListComponent } from '@shared/historic-list/components/historic-list/historic-list.component';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS,
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { TabComponent } from '@shared/tabs-bar/components/tab/tab.component';
import { TabsBarComponent } from '@shared/tabs-bar/components/tabs-bar/tabs-bar.component';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { ReplaySubject } from 'rxjs';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';

import { WalletHistoryMovementsComponent } from './wallet-history-movements.component';
import { WalletHistoryMovementsModule } from './wallet-history-movements.module';

describe('WalletHistoryMovementsComponent', () => {
  let component: WalletHistoryMovementsComponent;
  let fixture: ComponentFixture<WalletHistoryMovementsComponent>;
  let walletHistoryMovementsUIService: WalletHistoryMovementsUIService;
  let walletHistoryMovementsGetItemsSpy: jasmine.Spy;

  const walletBalanceLoadingReplaySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  const walletBalanceHistoricListReplaySubject: ReplaySubject<HistoricList> = new ReplaySubject(1);

  const spinnerSelector = '.spinner';
  const totalBalanceSelector = '.HistoricList__total-balance';
  const emptyStateSelector = '.HistoricList__no-results';

  class MockWalletHistoryMovementsUIService {
    get noMoreItemsAvailable() {
      return false;
    }
    loading$ = walletBalanceLoadingReplaySubject.asObservable();
    historicList$ = walletBalanceHistoricListReplaySubject.asObservable();
    getItems = () => {};
    reset = () => {};
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletHistoryMovementsModule, HttpClientTestingModule, TabsBarModule],
      declarations: [WalletHistoryMovementsComponent],
      providers: [
        {
          provide: WalletHistoryMovementsUIService,
          useClass: MockWalletHistoryMovementsUIService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHistoryMovementsComponent);
    component = fixture.componentInstance;
    walletHistoryMovementsUIService = TestBed.inject(WalletHistoryMovementsUIService);
    walletHistoryMovementsGetItemsSpy = spyOn(walletHistoryMovementsUIService, 'getItems');
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
    beforeEach(() => {
      walletBalanceLoadingReplaySubject.next(true);
      fixture.detectChanges();
    });

    it('should show a loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeTruthy();
    });
  });

  describe('when server respons with valid answer', () => {
    beforeEach(fakeAsync(() => {
      walletBalanceLoadingReplaySubject.next(false);
      walletBalanceHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS);
      tick();
      fixture.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });

    it('should show as many movements as web context mapped from server', () => {
      const expectedNumberOfElements: number = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS);
      const historyDetailsDebugElements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));

      expect(historyDetailsDebugElements.length).toBe(expectedNumberOfElements);
    });

    describe('and when displaying total balance', () => {
      it('should show total balance only at the first displayed month', () => {
        const totalBalanceElements = fixture.debugElement.queryAll(By.css(totalBalanceSelector));

        expect(totalBalanceElements.length).toBe(1);
      });

      it('should display total balance', () => {
        const totalBalanceElement = fixture.debugElement.query(By.css(totalBalanceSelector));
        const expectedText = $localize`:@@movements_history_all_users_current_balance_label:Current balance: ${MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS.totalBalance}`;
        const result = totalBalanceElement.nativeElement.innerHTML.trim();

        expect(result).toBe(expectedText);
      });

      describe('and when user filters transactions', () => {
        beforeEach(() => {
          const filtersDebugElement = fixture.debugElement.query(By.directive(TabsBarComponent));

          filtersDebugElement.triggerEventHandler(
            'onChange',
            component.tabBarElements.find((te) => te.value === WALLET_HISTORY_FILTERS.IN)
          );
          fixture.detectChanges();
        });

        it('should not show the total balance', () => {
          const totalBalanceElement = fixture.debugElement.query(By.css(totalBalanceSelector));

          expect(totalBalanceElement).toBeFalsy();
        });
      });
    });

    describe('and when user clicks on a filter', () => {
      it('should ask server for filtered movements', () => {
        walletHistoryMovementsGetItemsSpy.calls.reset();
        const filtersDebugElement = fixture.debugElement.query(By.directive(TabsBarComponent));

        filtersDebugElement.triggerEventHandler(
          'onChange',
          component.tabBarElements.find((te) => te.value === WALLET_HISTORY_FILTERS.IN)
        );

        expect(walletHistoryMovementsUIService.getItems).toHaveBeenCalledTimes(1);
        expect(walletHistoryMovementsUIService.getItems).toHaveBeenCalledWith(WALLET_HISTORY_FILTERS.IN);
      });
    });

    describe('and when user scrolls', () => {
      let historicListElement: DebugElement;

      beforeEach(() => {
        walletHistoryMovementsGetItemsSpy.calls.reset();
        historicListElement = fixture.debugElement.query(By.directive(HistoricListComponent));
        historicListElement.triggerEventHandler('scrolled', {});
        walletBalanceHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS);
        fixture.detectChanges();
      });

      it('should ask for another page', () => {
        expect(walletHistoryMovementsUIService.getItems).toHaveBeenCalledTimes(1);
        expect(walletHistoryMovementsUIService.getItems).toHaveBeenCalledWith(WALLET_HISTORY_FILTERS.ALL);
      });

      it('should display all movements from the server', () => {
        const walletMovements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));
        const movementsComponentsLength = walletMovements.length;
        const expectedLength = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS);

        expect(movementsComponentsLength).toEqual(expectedLength);
      });

      describe('and when there are no more pages', () => {
        beforeEach(() => {
          walletBalanceHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_EMPTY);
          jest.spyOn(walletHistoryMovementsUIService, 'noMoreItemsAvailable', 'get').mockReturnValue(true);
          fixture.detectChanges();
        });

        it('should disable scrolling', () => {
          const historicListComponent: HistoricListComponent = fixture.debugElement.query(By.directive(HistoricListComponent))
            .componentInstance;

          expect(historicListComponent.infiniteScrollDisabled).toBe(true);
        });
      });
    });

    describe('and when server respons with an empty list', () => {
      beforeEach(() => {
        walletBalanceHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_EMPTY);
        fixture.detectChanges();
      });

      it('should show no results found', () => {
        const emptyStateElement = fixture.debugElement.query(By.css(emptyStateSelector));
        const expectedText = $localize`:@@web_no_results:No results found`;
        const result = emptyStateElement.nativeElement.innerHTML.trim();

        expect(result).toEqual(expectedText);
      });
    });
  });

  function countHistoricElementsFromList(historicList: HistoricList): number {
    let totalHistoricElements = 0;
    historicList.elements.forEach((h) => h.elements.forEach((st) => st.elements.forEach(() => totalHistoricElements++)));
    return totalHistoricElements;
  }
});
