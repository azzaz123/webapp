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
import { PATH_TO_ACCEPT_SCREEN, PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineOngoingComponent } from '@private/features/delivery/pages/streamline/pages/streamline-ongoing/streamline-ongoing.component';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { of, ReplaySubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalMock } from '@fixtures/ngb-modal.fixtures.spec';
import { ContinueDeliveryPaymentService } from '@private/shared/continue-delivery-payment/continue-delivery-payment';
import { PAYMENT_CONTINUED_POST_ACTION } from '@private/shared/continue-delivery-payment/enums/payment-continued-post-action.enum';

const PATH_TO_ACCEPT_SCREEN_WITH_REQUEST_ID: string = `${PATH_TO_ACCEPT_SCREEN}/${MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER.id}`;

describe('StreamlineOngoingComponent', () => {
  let component: StreamlineOngoingComponent;
  let fixture: ComponentFixture<StreamlineOngoingComponent>;
  let streamlineOngoingUIService: StreamlineOngoingUIService;
  let continueDeliveryPaymentService: ContinueDeliveryPaymentService;
  let errorActionService: SharedErrorActionService;
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
        { provide: SharedErrorActionService, useValue: MockSharedErrorActionService },
        { provide: NgbModal, useClass: NgbModalMock },
        { provide: ContinueDeliveryPaymentService, useValue: { continue: () => of(null) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineOngoingComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    streamlineOngoingUIService = TestBed.inject(StreamlineOngoingUIService);
    continueDeliveryPaymentService = TestBed.inject(ContinueDeliveryPaymentService);
    errorActionService = TestBed.inject(SharedErrorActionService);

    fixture.detectChanges();
    spyOn(router, 'navigate');
    spyOn(continueDeliveryPaymentService, 'continue').and.callThrough();
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
          beforeEach(() => component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER));
          it('should delegate click handle to continue payment logic once', () => {
            expect(continueDeliveryPaymentService.continue).toHaveBeenCalledTimes(1);
          });

          it('should delegate click handle to continue payment logic with valid data', () => {
            expect(continueDeliveryPaymentService.continue).toHaveBeenCalledWith(
              MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER.id,
              MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_BUYER.payload.item.id,
              PAYMENT_CONTINUED_POST_ACTION.REDIRECT_TTS
            );
          });
        });

        describe('and the user is the seller', () => {
          it('should navigate to the accept screen page', () => {
            component.onItemClick(MOCK_HISTORIC_ELEMENT_WITH_REQUEST_AS_SELLER);

            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([PATH_TO_ACCEPT_SCREEN_WITH_REQUEST_ID]);
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

  describe('when there is an error retrieving the list', () => {
    beforeEach(() => {
      spyOn(errorActionService, 'show');

      historicListReplaySubject.error('Errorsito');
    });

    it('should show the generic error catcher', fakeAsync(() => {
      expect(errorActionService.show).toHaveBeenCalledTimes(1);
    }));
  });

  function countHistoricElementsFromList(historicList: HistoricList): number {
    let totalHistoricElements = 0;
    historicList.elements.forEach((h) => h.elements.forEach((st) => st.elements.forEach(() => totalHistoricElements++)));
    return totalHistoricElements;
  }
});
