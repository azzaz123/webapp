import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { HistoricListComponent } from '@shared/historic-list/components/historic-list/historic-list.component';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS,
  MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { TabComponent } from '@shared/tabs-bar/components/tab/tab.component';
import { TabsBarComponent } from '@shared/tabs-bar/components/tabs-bar/tabs-bar.component';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { WalletHistoryMovementsComponent } from '@private/features/wallet/pages/wallet-history-movements/wallet-history-movements.component';
import { WalletHistoryMovementsModule } from '@private/features/wallet/pages/wallet-history-movements/wallet-history-movements.module';
import { WalletHistoryMovementsTrackingEventService } from '@private/features/wallet/pages/wallet-history-movements/services/tracking-event/wallet-history-movements-tracking-event.service';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';

import { ReplaySubject } from 'rxjs';
import { MOCK_HISTORIC_ELEMENT } from '@shared/historic-list/fixtures/historic-element.fixtures.spec';

describe('WalletHistoryMovementsComponent', () => {
  let component: WalletHistoryMovementsComponent;
  let fixture: ComponentFixture<WalletHistoryMovementsComponent>;
  let walletHistoryMovementsUIService: WalletHistoryMovementsUIService;
  let walletHistoryMovementsGetItemsSpy: jasmine.Spy;
  let walletHistoryMovementsTrackingEventService: WalletHistoryMovementsTrackingEventService;

  const walletBalanceLoadingReplaySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  const walletBalanceHistoricListReplaySubject: ReplaySubject<HistoricList> = new ReplaySubject(1);

  const spinnerSelector = '.spinner';
  const totalBalanceSelector = '.HistoricList__total-balance';
  const emptyStateSelector = '.HistoricList__no-results';

  class MockWalletHistoryMovementsUIService {
    get infiniteScrollDisabled() {
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
        {
          provide: WalletHistoryMovementsTrackingEventService,
          useValue: {
            trackClickItemWalletMovement() {},
            trackViewWalletHistoryMovement() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHistoryMovementsComponent);
    component = fixture.componentInstance;
    walletHistoryMovementsUIService = TestBed.inject(WalletHistoryMovementsUIService);
    walletHistoryMovementsGetItemsSpy = spyOn(walletHistoryMovementsUIService, 'getItems');
    walletHistoryMovementsTrackingEventService = TestBed.inject(WalletHistoryMovementsTrackingEventService);
    fixture.detectChanges();
  });

  describe('WHEN starting', () => {
    let walletHistoryMovementsTrackingEventServiceSpy;

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

    describe('AND WHEN the backend returns the list of movements', () => {
      beforeEach(fakeAsync(() => {
        walletHistoryMovementsTrackingEventServiceSpy = spyOn(walletHistoryMovementsTrackingEventService, 'trackViewWalletHistoryMovement');
        walletBalanceHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS);
        tick();
        fixture.detectChanges();
      }));

      it('should call to the analytics service', () => {
        expect(walletHistoryMovementsTrackingEventServiceSpy).toHaveBeenCalledTimes(1);
        expect(walletHistoryMovementsTrackingEventServiceSpy).toHaveBeenCalledWith(
          MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS.elements.length
        );
      });
    });
  });

  describe('when user exits page', () => {
    it('should reset historic movements', () => {
      spyOn(walletHistoryMovementsUIService, 'reset');

      component.ngOnDestroy();

      expect(walletHistoryMovementsUIService.reset).toHaveBeenCalledTimes(1);
    });
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
            'handleOnClick',
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
          'handleOnClick',
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
          jest.spyOn(walletHistoryMovementsUIService, 'infiniteScrollDisabled', 'get').mockReturnValue(true);
          fixture.detectChanges();
        });

        it('should disable scrolling', () => {
          const historicListComponent: HistoricListComponent = fixture.debugElement.query(
            By.directive(HistoricListComponent)
          ).componentInstance;

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

    describe('WHEN user clicks over a historic element', () => {
      it('should track the corresponding event', () => {
        spyOn(walletHistoryMovementsTrackingEventService, 'trackClickItemWalletMovement');

        component.onChangeFilter(WALLET_HISTORY_FILTERS.ALL);
        component.onItemClick(MOCK_HISTORIC_ELEMENT);

        expect(walletHistoryMovementsTrackingEventService.trackClickItemWalletMovement).toHaveBeenCalledTimes(1);
        expect(walletHistoryMovementsTrackingEventService.trackClickItemWalletMovement).toHaveBeenCalledWith(WALLET_HISTORY_FILTERS.ALL);
      });
    });
  });

  function countHistoricElementsFromList(historicList: HistoricList): number {
    let totalHistoricElements = 0;
    historicList.elements.forEach((h) => h.elements.forEach((st) => st.elements.forEach(() => totalHistoricElements++)));
    return totalHistoricElements;
  }
});
