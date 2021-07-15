import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EventService } from '@core/event/event.service';
import { PaymentService } from '@core/payments/payment.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { USER_DATA } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WallacoinsDisabledModalComponent } from '@shared/modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { CustomCurrencyPipe } from '@shared/pipes';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { TopbarComponent } from './topbar.component';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { By } from '@angular/platform-browser';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { Router } from '@angular/router';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { TopbarTrackingEventsService } from '@layout/topbar/core/services/topbar-tracking-events/topbar-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { SuggesterComponentStub } from '@fixtures/shared/components/suggester.component.stub';

const MOCK_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug
);
const windowMock = {
  location: {
    href: '',
  },
};

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let userService: UserService;
  let fixture: ComponentFixture<TopbarComponent>;
  let eventService: EventService;
  const CURRENCY = 'wallacoins';
  const CREDITS = 1000;
  let paymentService: PaymentService;
  let cookieService: CookieService;
  let modalService: NgbModal;
  let featureFlagService: FeatureFlagServiceMock;
  let router: Router;
  let navigator: SearchNavigatorService;
  let topbarTrackingEventsService: TopbarTrackingEventsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NgxPermissionsModule.forRoot()],
        providers: [
          DecimalPipe,
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
              isProfessional() {
                return of(true);
              },
              get isLogged(): boolean {
                return true;
              },
            },
          },
          {
            provide: PaymentService,
            useValue: {
              getCreditInfo() {
                return of({
                  currencyName: CURRENCY,
                  credit: CREDITS,
                });
              },
            },
          },
          {
            provide: UnreadChatMessagesService,
            useValue: {
              totalUnreadMessages$: of(1),
            },
          },
          {
            provide: 'SUBDOMAIN',
            useValue: 'www',
          },
          {
            provide: CookieService,
            useValue: {
              put(key, value) {},
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  componentInstance: {},
                  result: Promise.resolve('success'),
                };
              },
            },
          },
          {
            provide: FeatureFlagService,
            useClass: FeatureFlagServiceMock,
          },
          {
            provide: WINDOW_TOKEN,
            useValue: windowMock,
          },
          EventService,
          SearchQueryStringService,
          QueryStringLocationService,
          TopbarTrackingEventsService,
          {
            provide: AnalyticsService,
            useValue: MockAnalyticsService,
          },
          {
            provide: SuggesterService,
            useValue: {},
          },
        ],
        declarations: [SuggesterComponentStub, TopbarComponent, CustomCurrencyPipe],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      userService = TestBed.inject(UserService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
    eventService = TestBed.inject(EventService);
    paymentService = TestBed.inject(PaymentService);
    cookieService = TestBed.inject(CookieService);
    modalService = TestBed.inject(NgbModal);
    featureFlagService = TestBed.inject(FeatureFlagService);
    navigator = TestBed.inject(SearchNavigatorService);
    router = TestBed.inject(Router);
    topbarTrackingEventsService = TestBed.inject(TopbarTrackingEventsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set user session', () => {
      component.isLogged = null;

      component.ngOnInit();

      expect(component.isLogged).toBe(true);
    });

    it('should update user session on user login', () => {
      component.isLogged = null;

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN);

      expect(component.isLogged).toBe(true);
    });

    it('should update user session on user logout', () => {
      component.isLogged = null;

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(component.isLogged).toBe(true);
    });

    it('should set the private user variable with the content of the user', () => {
      component.user = null;

      component.ngOnInit();

      expect(component.user).toBe(MOCK_USER);
    });

    it('should call isProfessional and set the attribute', () => {
      spyOn(userService, 'isProfessional').and.callThrough();

      component.ngOnInit();

      expect(userService.isProfessional).toHaveBeenCalled();
      expect(component.isProfessional).toBe(true);
    });

    it('should call getCreditInfo and set currency and coins total', () => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();

      component.ngOnInit();

      expect(paymentService.getCreditInfo).toHaveBeenCalled();
      expect(component.currencyName).toBe(CURRENCY);
      expect(component.wallacoins).toBe(CREDITS);
    });

    it('should update wallacoins on TOTAL_CREDITS_UPDATED event', () => {
      const CREDITS = 100;
      component.ngOnInit();

      eventService.emit(EventService.TOTAL_CREDITS_UPDATED, CREDITS);

      expect(component.wallacoins).toBe(CREDITS);
    });

    it('should call getCreditInfo on TOTAL_CREDITS_UPDATED event if no credits passed', () => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();
      component.ngOnInit();

      eventService.emit(EventService.TOTAL_CREDITS_UPDATED);

      expect(paymentService.getCreditInfo).toHaveBeenCalledWith(false);
      expect(component.currencyName).toBe(CURRENCY);
      expect(component.wallacoins).toBe(CREDITS);
    });

    it('should set the credits cookies', () => {
      spyOn(cookieService, 'put');
      const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };

      component.ngOnInit();

      expect(cookieService.put).toHaveBeenCalledWith('creditName', component.currencyName, cookieOptions);
      expect(cookieService.put).toHaveBeenCalledWith('creditQuantity', component.wallacoins.toString(), cookieOptions);
    });
  });

  describe('when user session changes', () => {
    const suggesterSelector = '#top-bar-suggester';
    const messagesBtnSelector = '#top-bar-inbox';
    const wallacoinsBtnSelector = '#top-bar-wallacoins';
    const myZoneBtnSelector = '#top-bar-my-zone';
    const signinSignupBtnSelector = '#top-bar-signin';
    const newProductBtnSelector = '#top-bar-upload';

    describe('when user is logged', () => {
      beforeEach(() => {
        component.isLogged = true;
        fixture.detectChanges();
      });
      it('should show logged elements', () => {
        expect(el.querySelector(suggesterSelector)).not.toBeNull();
        expect(el.querySelector(messagesBtnSelector)).not.toBeNull();
        expect(el.querySelector(wallacoinsBtnSelector)).not.toBeNull();
        expect(el.querySelector(myZoneBtnSelector)).not.toBeNull();
        expect(el.querySelector(newProductBtnSelector)).not.toBeNull();
      });

      it('should not show no logged elements', () => {
        expect(el.querySelector(signinSignupBtnSelector)).toBeNull();
      });
    });

    describe('when user is not logged', () => {
      beforeEach(() => {
        component.isLogged = false;
        fixture.detectChanges();
      });

      it('should show not logged elements', () => {
        expect(el.querySelector(suggesterSelector)).not.toBeNull();
        expect(el.querySelector(messagesBtnSelector)).not.toBeNull();
        expect(el.querySelector(signinSignupBtnSelector)).not.toBeNull();
        expect(el.querySelector(newProductBtnSelector)).not.toBeNull();
      });

      it('should not show logged elements', () => {
        expect(el.querySelector(wallacoinsBtnSelector)).toBeNull();
        expect(el.querySelector(myZoneBtnSelector)).toBeNull();
      });
    });
  });

  describe('Search box', () => {
    describe('when a new search has been submitted from the search box', () => {
      const MOCK_SEARCH_BOX_VALUE: SearchBoxValue = {
        [FILTER_QUERY_PARAM_KEY.keywords]: 'iphone',
        [FILTER_QUERY_PARAM_KEY.categoryId]: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`,
      };

      describe('and the user does not select any suggestion', () => {
        const MOCK_SEARCH_BOX_ONLY_TEXT_VALUE: SearchBoxValue = {
          [FILTER_QUERY_PARAM_KEY.keywords]: 'iphone',
        };

        it('should send click keyboard search button event', () => {
          const searchBox = fixture.debugElement.query(By.directive(SuggesterComponentStub));
          spyOn(topbarTrackingEventsService, 'trackClickKeyboardSearchButtonEvent');

          searchBox.triggerEventHandler('searchSubmit', MOCK_SEARCH_BOX_ONLY_TEXT_VALUE);

          expect(topbarTrackingEventsService.trackClickKeyboardSearchButtonEvent).toHaveBeenCalledWith(
            MOCK_SEARCH_BOX_ONLY_TEXT_VALUE.keywords
          );
        });
      });

      describe('and the experimental features flag is enabled', () => {
        it('should navigate to the new search page', () => {
          const searchBox = fixture.debugElement.query(By.directive(SuggesterComponentStub));
          spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(true);
          spyOn(navigator, 'navigate');

          searchBox.triggerEventHandler('searchSubmit', MOCK_SEARCH_BOX_VALUE);

          expect(navigator.navigate).toHaveBeenCalledWith(
            [
              { key: 'keywords', value: 'iphone' },
              { key: 'category_ids', value: '16000' },
            ],
            FILTERS_SOURCE.SEARCH_BOX,
            true
          );
        });
      });

      describe('and the experimental features flag is not enabled', () => {
        it('should redirect to the old search page', () => {
          const searchBox = fixture.debugElement.query(By.directive(SuggesterComponentStub));
          const { category_ids, keywords } = MOCK_SEARCH_BOX_VALUE;
          const expectedUrl = `${component.homeUrl}${PUBLIC_PATHS.SEARCH}?${FILTER_QUERY_PARAM_KEY.categoryId}=${category_ids}&${FILTER_QUERY_PARAM_KEY.keywords}=${keywords}&${FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE}=${FILTERS_SOURCE.SEARCH_BOX}`;
          spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(false);
          spyOn(router, 'navigate');

          searchBox.triggerEventHandler('searchSubmit', MOCK_SEARCH_BOX_VALUE);

          expect(router.navigate).not.toHaveBeenCalled();
          expect(window.location.href).toEqual(expectedUrl);
        });
      });
    });

    describe('when a search has been canceled from the search box', () => {
      const MOCK_SEARCH_BOX_VALUE: SearchBoxValue = {
        [FILTER_QUERY_PARAM_KEY.keywords]: 'iphone',
        [FILTER_QUERY_PARAM_KEY.categoryId]: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`,
      };

      describe('and the experimental features flag is enabled', () => {
        beforeEach(() => {
          const searchBox = fixture.debugElement.query(By.directive(SuggesterComponentStub));
          spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(true);
          spyOn(navigator, 'navigate');
          spyOn(topbarTrackingEventsService, 'trackCancelSearchEvent');

          searchBox.triggerEventHandler('searchCancel', MOCK_SEARCH_BOX_VALUE);
        });

        it('should navigate to the new search page', () => {
          expect(navigator.navigate).toHaveBeenCalledWith(
            [{ key: FILTER_QUERY_PARAM_KEY.keywords, value: '' }],
            FILTERS_SOURCE.SEARCH_BOX,
            true
          );
        });

        it('should send cancel search event', () => {
          expect(topbarTrackingEventsService.trackCancelSearchEvent).toHaveBeenCalledWith(MOCK_SEARCH_BOX_VALUE.keywords);
        });
      });

      describe('and the experimental features flag is not enabled', () => {
        beforeEach(() => {
          const searchBox = fixture.debugElement.query(By.directive(SuggesterComponentStub));
          spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(false);
          spyOn(router, 'navigate');
          spyOn(topbarTrackingEventsService, 'trackCancelSearchEvent');

          searchBox.triggerEventHandler('searchCancel', MOCK_SEARCH_BOX_VALUE);
        });

        it('should redirect to the old search page', () => {
          const expectedUrl = `${component.homeUrl}${PUBLIC_PATHS.SEARCH}?${FILTER_QUERY_PARAM_KEY.keywords}=&${FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE}=${FILTERS_SOURCE.SEARCH_BOX}`;

          expect(router.navigate).not.toHaveBeenCalled();
          expect(window.location.href).toEqual(expectedUrl);
        });

        it('should send cancel search event', () => {
          expect(topbarTrackingEventsService.trackCancelSearchEvent).toHaveBeenCalledWith(MOCK_SEARCH_BOX_VALUE.keywords);
        });
      });
    });
  });

  describe('Credit', () => {
    const wallacoinsBtnSelector = '#top-bar-wallacoins';

    it('should show credit when credit is > 0', () => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      expect(el.querySelector(wallacoinsBtnSelector)).not.toBeNull();
    });

    it('should not show credit when credit is = 0', () => {
      spyOn(paymentService, 'getCreditInfo').and.returnValue(
        of({
          currencyName: CURRENCY,
          credit: 0,
        })
      );

      component.ngOnInit();
      fixture.detectChanges();

      expect(el.querySelector(wallacoinsBtnSelector)).toBeNull();
    });

    it('should open modal when credit es clicked', () => {
      spyOn(modalService, 'open').and.callThrough();

      el.querySelector<any>(wallacoinsBtnSelector).click();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(WallacoinsDisabledModalComponent, {
        backdrop: 'static',
        windowClass: 'modal-standard',
      });
    });
  });
});
