import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { HistoricListComponent } from '@shared/historic-list/components/historic-list/historic-list.component';
import {
  MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE,
  MOCK_HISTORIC_LIST_EMPTY,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ReplaySubject } from 'rxjs';
import { StreamlineCompletedUIService } from '../../services/streamline-completed-ui/streamline-completed-ui.service';

import { StreamlineCompletedComponent } from './streamline-completed.component';

describe('StreamlineCompletedComponent', () => {
  let component: StreamlineCompletedComponent;
  let fixture: ComponentFixture<StreamlineCompletedComponent>;
  let streamlineCompletedUIService: StreamlineCompletedUIService;
  let streamlineCompletedUIServiceGetItemsSpy: jasmine.Spy;

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
      providers: [{ provide: StreamlineCompletedUIService, useClass: MockStreamlineCompletedUIService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamlineCompletedComponent);
    component = fixture.componentInstance;
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
      streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE);
      tick();
      fixture.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });

    it('should show as many movements as web context mapped from server', () => {
      const expectedNumberOfElements: number = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE);
      const historyDetailsDebugElements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));

      expect(historyDetailsDebugElements.length).toBe(expectedNumberOfElements);
    });

    describe('and when user scrolls', () => {
      let historicListElement: DebugElement;

      beforeEach(() => {
        streamlineCompletedUIServiceGetItemsSpy.calls.reset();
        historicListElement = fixture.debugElement.query(By.directive(HistoricListComponent));
        historicListElement.triggerEventHandler('scrolled', {});
        streamlineCompletedHistoricListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE);
        fixture.detectChanges();
      });

      it('should ask for another page', () => {
        expect(streamlineCompletedUIService.getItems).toHaveBeenCalledTimes(1);
      });

      it('should display all movements from the server', () => {
        const walletMovements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));
        const movementsComponentsLength = walletMovements.length;
        const expectedLength = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE);

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
