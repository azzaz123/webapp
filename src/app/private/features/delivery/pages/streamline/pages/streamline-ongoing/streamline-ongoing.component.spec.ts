import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { MOCK_HISTORIC_ELEMENT_WITH_ID } from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS,
  MOCK_HISTORIC_LIST_EMPTY,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ReplaySubject } from 'rxjs';
import { StreamlineOngoingUIService } from '../../services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { StreamlineOngoingComponent } from './streamline-ongoing.component';

describe('StreamlineOngoingComponent', () => {
  let component: StreamlineOngoingComponent;
  let fixture: ComponentFixture<StreamlineOngoingComponent>;
  let streamlineOngoingUIService: StreamlineOngoingUIService;
  let router: Router;

  let loadingReplaySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  let historicListReplaySubject: ReplaySubject<HistoricList> = new ReplaySubject(1);

  let spinnerSelector: string = '.spinner';
  let emptyStateSelector: string = '.HistoricList__no-results';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HistoricListModule, SvgIconModule],
      declarations: [StreamlineOngoingComponent],
      providers: [
        {
          provide: StreamlineOngoingUIService,
          useValue: {
            loading$: loadingReplaySubject.asObservable(),
            historicList$: historicListReplaySubject.asObservable(),
            getItems: () => {},
            reset: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineOngoingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
    fixture.detectChanges();

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('while waiting for server to respon', () => {
    beforeEach(() => {
      loadingReplaySubject.next(true);
      fixture.detectChanges();
    });

    it('should show a loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeTruthy();
    });
  });

  describe('when server respons with valid answer', () => {
    beforeEach(fakeAsync(() => {
      loadingReplaySubject.next(false);
      historicListReplaySubject.next(MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS);
      tick();
      fixture.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });

    it('should show as many movements as web context mapped from server', () => {
      const expectedNumberOfElements: number = countHistoricElementsFromList(MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS);
      const historyDetailsDebugElements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));

      expect(historyDetailsDebugElements.length).toBe(expectedNumberOfElements);
    });

    describe('and when server respons with an empty list', () => {
      beforeEach(() => {
        historicListReplaySubject.next(MOCK_HISTORIC_LIST_EMPTY);
        fixture.detectChanges();
      });

      it('should show no results found', () => {
        const emptyStateElement = fixture.debugElement.query(By.css(emptyStateSelector));
        const expectedText = $localize`:@@web_no_results:No results found`;
        const result = emptyStateElement.nativeElement.innerHTML.trim();

        expect(result).toEqual(expectedText);
      });
    });

    describe('when user clicks on a historic element', () => {
      it('should navigate to the tracking page', () => {
        const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_HISTORIC_ELEMENT_WITH_ID.id}`;

        component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_ID);

        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('when user exits page', () => {
      it('should reset historic movements', () => {
        spyOn(streamlineOngoingUIService, 'reset');

        component.ngOnDestroy();

        expect(streamlineOngoingUIService.reset).toHaveBeenCalledTimes(1);
      });
    });
  });

  function countHistoricElementsFromList(historicList: HistoricList): number {
    let totalHistoricElements = 0;
    historicList.elements.forEach((h) => h.elements.forEach((st) => st.elements.forEach(() => totalHistoricElements++)));
    return totalHistoricElements;
  }
});
