import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElementComponent } from '@shared/historic-list/components/historic-element/historic-element.component';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';
import {
  MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER,
  MOCK_HISTORIC_ELEMENT_WITH_DELIVERY_PENDING_TRANSACTION,
  MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER,
} from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS,
  MOCK_HISTORIC_LIST_EMPTY,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { MockSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineOngoingComponent } from '@private/features/delivery/pages/streamline/pages/streamline-ongoing/streamline-ongoing.component';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { ReplaySubject, throwError, of, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalMock } from '@fixtures/ngb-modal.fixtures.spec';
import { AcceptScreenAwarenessModalComponent } from '@private/features/delivery/modals/accept-screen-awareness-modal/accept-screen-awareness-modal.component';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';

const PATH_TO_ACCEPT_SCREEN: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ACCEPT_SCREEN}/${MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER.id}`;

describe('StreamlineOngoingComponent', () => {
  let component: StreamlineOngoingComponent;
  let fixture: ComponentFixture<StreamlineOngoingComponent>;
  let streamlineOngoingUIService: StreamlineOngoingUIService;
  let router: Router;
  let modalService: NgbModal;
  let featureflagService: FeatureFlagService;

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
        {
          provide: FeatureFlagService,
          useValue: {
            getLocalFlag(_flag: FEATURE_FLAGS_ENUM.DELIVERY): Observable<boolean> {
              return of(false);
            },
          },
        },
        { provide: SharedErrorActionService, useValue: MockSharedErrorActionService },
        { provide: NgbModal, useClass: NgbModalMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineOngoingComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
    modalService = TestBed.inject(NgbModal);
    featureflagService = TestBed.inject(FeatureFlagService);

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
      describe('and the element is a request', () => {
        describe('and the user is the buyer', () => {
          it('should navigate to the tracking page with the id', () => {
            const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER.id}`;

            component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER);

            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
          });
        });

        describe('and the user is the seller', () => {
          describe('and the delivery feature flag is NOT enabled', () => {
            beforeEach(() => {
              spyOn(modalService, 'open').and.callThrough();

              component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER);
            });

            it('should stay at the same page', () => {
              expect(router.navigate).not.toHaveBeenCalled();
            });

            it('should open the accept screen awareness modal', () => {
              expect(modalService.open).toHaveBeenCalledTimes(1);
              expect(modalService.open).toHaveBeenCalledWith(AcceptScreenAwarenessModalComponent);
            });
          });

          describe('and the delivery feature flag is enabled', () => {
            it('should navigate to the accept screen page', () => {
              spyOn(featureflagService, 'getLocalFlag').and.returnValue(of(true));

              component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER);

              expect(router.navigate).toHaveBeenCalledTimes(1);
              expect(router.navigate).toHaveBeenCalledWith([PATH_TO_ACCEPT_SCREEN]);
            });
          });
        });
      });

      describe('and the element is a pending transaction', () => {
        it('should navigate to the tracking page with the payload request id', () => {
          const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_HISTORIC_ELEMENT_WITH_DELIVERY_PENDING_TRANSACTION.id}`;

          component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_DELIVERY_PENDING_TRANSACTION);

          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
        });
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

describe('WHEN there is an error retrieving the shipping list', () => {
  let errorActionSpy;
  let streamlineOngoingUIService;
  let errorActionService;
  let component: StreamlineOngoingComponent;
  let fixture: ComponentFixture<StreamlineOngoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HistoricListModule, SvgIconModule],
      declarations: [StreamlineOngoingComponent],
      providers: [
        {
          provide: StreamlineOngoingUIService,
          useValue: {
            get historicList$() {
              return throwError('The server is broken');
            },
            getItems: () => {},
            reset: () => {},
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            getLocalFlag(_flag: FEATURE_FLAGS_ENUM.DELIVERY): Observable<boolean> {
              return of(false);
            },
          },
        },
        { provide: SharedErrorActionService, useValue: MockSharedErrorActionService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
    jest.spyOn(streamlineOngoingUIService, 'historicList$', 'get').mockReturnValue(throwError('The server is broken'));
    errorActionService = TestBed.inject(SharedErrorActionService);
    errorActionSpy = spyOn(errorActionService, 'show');

    fixture = TestBed.createComponent(StreamlineOngoingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should show the generic error catcher', fakeAsync(() => {
    expect(errorActionSpy).toHaveBeenCalledTimes(1);
  }));
});
