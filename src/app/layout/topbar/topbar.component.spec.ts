import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../core/user/user.service';
import { EventService } from '../../core/event/event.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { environment } from '../../../environments/environment';
import { SUGGESTER_DATA_WEB } from '../../../tests/suggester.fixtures.spec';
import { User } from '../../core/user/user';
import { USER_DATA } from '../../../tests/user.fixtures.spec';
import { MessageService } from '../../chat/service/message.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PaymentService } from '../../core/payments/payment.service';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NgxPermissionsModule.forRoot()],
        providers: [
          DecimalPipe,
          {
            provide: UserService,
            useValue: {
              me(): Observable<User> {
                return of(MOCK_USER);
              },
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
            provide: MessageService,
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
          EventService,
        ],
        declarations: [TopbarComponent, CustomCurrencyPipe],
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
      const cookieOptions =
        environment.name === 'local'
          ? { domain: 'localhost' }
          : { domain: '.wallapop.com' };

      component.ngOnInit();

      expect(cookieService.put).toHaveBeenCalledWith(
        'creditName',
        component.currencyName,
        cookieOptions
      );
      expect(cookieService.put).toHaveBeenCalledWith(
        'creditQuantity',
        component.wallacoins.toString(),
        cookieOptions
      );
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

  describe('update keyword', () => {
    const newKeyword = 'iphone';
    it('should update the keyword', () => {
      component.kws = 'iphone';
      component.onKeywordUpdate(newKeyword);
      expect(component.kws).toEqual(newKeyword);
    });
  });

  describe('update keyword', () => {
    const newKeyword = 'iphone';
    it('should update the keyword', () => {
      component.kws = 'iphone';
      component.onKeywordUpdate(newKeyword);
      expect(component.kws).toEqual(newKeyword);
    });
  });

  describe('search form', () => {
    beforeEach(() => {
      component.kwsEl = {
        nativeElement: {
          value: 'iphone',
        },
      };
    });

    describe('update search', () => {
      it('should update the category and keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();

        component.onSearchUpdate(SUGGESTER_DATA_WEB[0]);

        expect(component.category).toEqual(SUGGESTER_DATA_WEB[0].category_id);
        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    describe('search submit', () => {
      it('should update the keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();

        component.onSearchSubmit(SUGGESTER_DATA_WEB[0].suggestion);

        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    it('should redirect to the web when category is set', () => {
      component.category = CATEGORY_DATA_WEB[1].category_id;

      component.submitForm();

      expect(window.location.href).toEqual(
        environment.siteUrl.replace('es', 'www') +
          'search?category_ids=15000' +
          '&keywords='
      );
    });

    it('should submit the search form for cars', () => {
      component.category = CATEGORY_DATA_WEB[0].category_id;

      component.submitForm();

      expect(window.location.href).toEqual(
        environment.siteUrl.replace('es', 'www') +
          'search?category_ids=100' +
          '&keywords='
      );
    });
  });
});
