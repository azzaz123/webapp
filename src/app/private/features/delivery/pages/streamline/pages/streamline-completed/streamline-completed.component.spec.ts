import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { HistoricListComponent } from '@shared/historic-list/components/historic-list/historic-list.component';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { MockSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineCompletedComponent } from '@private/features/delivery/pages/streamline/pages/streamline-completed/streamline-completed.component';
import { StreamlineCompletedUIService } from '@private/features/delivery/pages/streamline/services/streamline-completed-ui/streamline-completed-ui.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { ReplaySubject, throwError } from 'rxjs';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { MOCK_HISTORIC_ELEMENT_WITH_HISTORIC_TRANSACTION } from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import { Router } from '@angular/router';

describe('StreamlineCompletedComponent', () => {
  let component: StreamlineCompletedComponent;
  let fixture: ComponentFixture<StreamlineCompletedComponent>;
  let streamlineCompletedUIService: StreamlineCompletedUIService;
  let streamlineCompletedUIServiceGetItemsSpy: jasmine.Spy;
  let router: Router;

  const streamlineCompletedLoadingReplaySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  const streamlineCompletedHistoricListReplaySubject: ReplaySubject<HistoricList> = new ReplaySubject(1);

  const spinnerSelector = '.spinner';
  const emptyStateSelector = '.HistoricList__no-results';

  class MockStreamlineCompletedUIService {
    get infiniteScrollDisabled() {
      return false;
    }
    loading$ = streamlineCompletedLoadingReplaySubject.asObservable();
    historicList$ = streamlineCompletedHistoricListReplaySubject.asObservable();
    getItems = () => {};
    reset = () => {};
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, HistoricListModule, SvgIconModule],
      declarations: [StreamlineCompletedComponent],
      providers: [
        { provide: StreamlineCompletedUIService, useClass: MockStreamlineCompletedUIService },
        { provide: SharedErrorActionService, useValue: MockSharedErrorActionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamlineCompletedComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    streamlineCompletedUIService = TestBed.inject(StreamlineCompletedUIService);
    streamlineCompletedUIServiceGetItemsSpy = spyOn(streamlineCompletedUIService, 'getItems');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user exits page', () => {
    it('should reset historic transactions', () => {
      spyOn(streamlineCompletedUIService, 'reset');

      component.ngOnDestroy();

      expect(streamlineCompletedUIService.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('while waiting for server to respon', () => {
    beforeEach(() => {
      streamlineCompletedLoadingReplaySubject.next(true);
      fixture.detectChanges();
    });

    it('should show a loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeTruthy();
    });
  });

  describe('when server respons with valid answer', () => {
    beforeEach(fakeAsync(() => {
      streamlineCompletedLoadingReplaySubject.next(false);
      streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS);
      tick();
      fixture.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });

    it('should show as many movements as web context mapped from server', () => {
      const expectedNumberOfElements: number = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS);
      const historyDetailsDebugElements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));

      expect(historyDetailsDebugElements.length).toBe(expectedNumberOfElements);
    });

    describe('when user clicks on a historic element', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
      });
      it('should navigate to the tracking page with the payload id', () => {
        const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_HISTORIC_ELEMENT_WITH_HISTORIC_TRANSACTION.payload.requestId}`;

        component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_HISTORIC_TRANSACTION);

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('and when user scrolls', () => {
      let historicListElement: DebugElement;

      beforeEach(() => {
        streamlineCompletedUIServiceGetItemsSpy.calls.reset();
        historicListElement = fixture.debugElement.query(By.directive(HistoricListComponent));
        historicListElement.triggerEventHandler('scrolled', {});
        streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS);
        fixture.detectChanges();
      });

      it('should ask for another page', () => {
        expect(streamlineCompletedUIService.getItems).toHaveBeenCalledTimes(1);
      });

      it('should display all movements from the server', () => {
        const walletMovements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));
        const movementsComponentsLength = walletMovements.length;
        const expectedLength = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS);

        expect(movementsComponentsLength).toEqual(expectedLength);
      });

      describe('and when there are no more pages', () => {
        beforeEach(() => {
          streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_EMPTY);
          jest.spyOn(streamlineCompletedUIService, 'infiniteScrollDisabled', 'get').mockReturnValue(true);
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
        streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_EMPTY);
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

describe('WHEN there is an error retrieving the shipping list', () => {
  let errorActionSpy;
  let streamlineOngoingUIService;
  let errorActionService;
  let component: StreamlineCompletedComponent;
  let fixture: ComponentFixture<StreamlineCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HistoricListModule, SvgIconModule],
      declarations: [StreamlineCompletedComponent],
      providers: [
        {
          provide: StreamlineCompletedUIService,
          useValue: {
            get historicList$() {
              return throwError('The server is broken');
            },
            getItems: () => {},
            reset: () => {},
          },
        },
        { provide: SharedErrorActionService, useValue: MockSharedErrorActionService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    streamlineOngoingUIService = TestBed.inject(StreamlineCompletedUIService);
    jest.spyOn(streamlineOngoingUIService, 'historicList$', 'get').mockReturnValue(throwError('The server is broken'));
    errorActionService = TestBed.inject(SharedErrorActionService);
    errorActionSpy = spyOn(errorActionService, 'show');

    fixture = TestBed.createComponent(StreamlineCompletedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should show the generic error catcher', fakeAsync(() => {
    expect(errorActionSpy).toHaveBeenCalledTimes(1);
  }));
});
