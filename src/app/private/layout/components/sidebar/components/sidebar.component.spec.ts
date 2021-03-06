import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { RouterLinkDirectiveStub } from '@shared/router-link-directive-stub';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject, of } from 'rxjs';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { SidebarComponent } from './sidebar.component';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickWallet,
  SCREEN_IDS,
  ViewOwnSaleItems,
} from '@core/analytics/analytics-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { SidebarService } from '../core/services/sidebar.service';
import { DeviceService } from '@core/device/device.service';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { SidebarNavigationProfileElementStubComponent } from '@fixtures/private/layout/sidebar/components/sidebar-navigation-profile-element.stub';

@Component({
  template: '',
})
export class MockComponent {}

const routes: Route[] = [
  { path: 'profile', component: MockComponent },
  { path: 'pro/dashboard', component: MockComponent },
  { path: 'catalog/list', component: MockComponent },
  { path: 'wallacoins', component: MockComponent },
  { path: 'chat', component: MockComponent },
  { path: 'favorites', component: MockComponent },
  { path: 'reviews', component: MockComponent },
  { path: 'pro/calls', component: MockComponent },
  { path: 'pro/help', component: MockComponent },
  { path: 'pro/stats', component: MockComponent },
  { path: 'wallet', component: MockComponent },
  { path: 'delivery', component: MockComponent },
];

const mockCounters = {
  sold: 7,
  publish: 12,
};

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;
  let router: Router;
  let analyticsService: AnalyticsService;
  let permissionService: NgxPermissionsService;
  let sidebarService: SidebarService;

  const collapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  const walletButtonSelector = '#sidebar-wallet';
  const deliveryButtonSelector = '.Sidebar__deliveryButton';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarComponent, RouterLinkDirectiveStub, SidebarNavigationProfileElementStubComponent, MockComponent],
        imports: [NgxPermissionsModule.forRoot(), RouterTestingModule.withRoutes(routes)],
        providers: [
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
              get isPro() {
                return true;
              },
              getStats() {
                return of({
                  counters: mockCounters,
                });
              },
              isProfessional() {
                return of(true);
              },
              suggestPro() {
                return false;
              },
              setClickedProSection() {},
              get isClickedProSection() {
                return false;
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
            provide: NotificationApiService,
            useValue: {
              totalUnreadNotifications$: of(0),
              getNotifications: () => {},
              refreshUnreadNotifications: () => {},
            },
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          NgxPermissionsService,
          {
            provide: SidebarService,
            useValue: {
              sidebarCollapsed$: collapsedSubject.asObservable(),
              toggleCollapse() {},
            },
          },
          {
            provide: DeviceService,
            useValue: {
              isTouchDevice() {
                return false;
              },
            },
          },
          {
            provide: CustomerHelpService,
            useValue: {
              getPageUrl() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
    permissionService = TestBed.inject(NgxPermissionsService);
    sidebarService = TestBed.inject(SidebarService);
    spyOn(analyticsService, 'trackPageView');
    spyOn(analyticsService, 'trackEvent');
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set the private user variable with the content of the user', () => {
      expect(component.user).toBe(MOCK_USER);
    });

    it('should call isProfessional and set the attribute', () => {
      spyOn(userService, 'isProfessional').and.callThrough();

      component.ngOnInit();

      expect(userService.isProfessional).toHaveBeenCalled();
      expect(component.isProfessional).toBe(true);
    });
  });

  describe('Sidebar icons', () => {
    it('should be shown catalog icon as "active" when it is in a product section', () => {
      component.isProducts = true;
      const element: HTMLElement = fixture.nativeElement.querySelector('#sidebar-catalog');

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('Sidebar__entry--active');
    });

    it('should be shown chat icon as "active" when is in chat url route', fakeAsync(() => {
      fixture.ngZone.run(() => {
        router.navigate(['chat']);

        tick();
        var activeLinks = fixture.debugElement
          .queryAll(By.css('.Sidebar__entry--active'))
          .map((element) => element.injector.get(RouterLinkDirectiveStub) as RouterLinkDirectiveStub);

        expect(activeLinks.length).toBe(1);
        expect(activeLinks[0].linkParams).toEqual(['/chat']);
      });
    }));

    describe('when click on catalog', () => {
      describe('and is not Pro', () => {
        beforeEach(() => {
          component.isProfessional = false;
        });

        describe('and has not to show pro banner', () => {
          it('should track event', () => {
            const element: HTMLElement = fixture.nativeElement.querySelector('#sidebar-catalog');
            const expectedEvent: AnalyticsPageView<ViewOwnSaleItems> = {
              name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
              attributes: {
                screenId: SCREEN_IDS.MyCatalog,
                numberOfItems: mockCounters.publish,
                proSubscriptionBanner: false,
                isPro: true,
              },
            };

            element.click();

            expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
            expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
          });
        });

        describe('and has to show pro banner', () => {
          it('should track event', () => {
            spyOn(userService, 'suggestPro').and.returnValue(true);
            const element: HTMLElement = fixture.nativeElement.querySelector('#sidebar-catalog');
            const expectedEvent: AnalyticsPageView<ViewOwnSaleItems> = {
              name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
              attributes: {
                screenId: SCREEN_IDS.MyCatalog,
                numberOfItems: mockCounters.publish,
                proSubscriptionBanner: true,
                isPro: true,
              },
            };

            element.click();

            expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
            expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
          });
        });
      });
      describe('and is cardealer', () => {
        it('should not track event', () => {
          component.isProfessional = true;
          const element: HTMLElement = fixture.nativeElement.querySelector('#sidebar-catalog');

          element.click();

          expect(analyticsService.trackPageView).not.toHaveBeenCalled();
        });
      });
    });
    describe('Pro icon', () => {
      describe('and has subscriptions permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
          fixture.detectChanges();
        });
        it('should show button', () => {
          const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');

          expect(proButton).toBeTruthy();
        });
        it('should redirect to pro section', () => {
          const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');
          fixture.detectChanges();

          expect(proButton.href).toContain([`/${PRO_PATHS.PRO_MANAGER}`]);
        });
        describe('and click icon', () => {
          beforeEach(() => {
            spyOn(userService, 'setClickedProSection').and.callThrough();
          });
          it('should save click', () => {
            const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');
            proButton.click();

            expect(userService.setClickedProSection).toHaveBeenCalledTimes(1);
            expect(userService.setClickedProSection).toHaveBeenCalledWith();
          });
        });
        describe('Notification Icon', () => {
          describe('and icon has to be shown', () => {
            beforeEach(() => {
              jest.spyOn(userService, 'isClickedProSection', 'get').mockReturnValue(false);
              component.ngOnInit();
              fixture.detectChanges();
            });
            it('should show icon', () => {
              const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');
              const notification = proButton.querySelector('.Sidebar__notification');

              expect(notification).toBeTruthy();
            });
          });
          describe('and icon has not to be shown', () => {
            beforeEach(() => {
              jest.spyOn(userService, 'isClickedProSection', 'get').mockReturnValue(true);
              component.ngOnInit();
              fixture.detectChanges();
            });
            it('should save click', () => {
              const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');
              const notification = proButton.querySelector('.Sidebar__notification');

              expect(notification).toBeFalsy();
            });
          });
        });
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
          fixture.detectChanges();
        });
        it('should not show button', () => {
          fixture.detectChanges();
          const proButton = fixture.debugElement.nativeElement.querySelector('#sidebar-pro');

          expect(proButton).toBeFalsy();
        });
      });
    });

    describe('when the collapsed state is collapsed', () => {
      it('should have the collapsed style', () => {
        collapsedSubject.next(true);

        fixture.detectChanges();
        const sidebarElement: HTMLElement = fixture.debugElement.query(By.css('.Sidebar')).nativeElement;

        expect(sidebarElement.classList).toContain('Sidebar--collapsed');
      });
    });

    describe('when the collapsed state is uncollapsed', () => {
      it('should not have the collapsed class', () => {
        collapsedSubject.next(false);

        fixture.detectChanges();
        const sidebarElement: HTMLElement = fixture.debugElement.query(By.css('.Sidebar')).nativeElement;

        expect(sidebarElement.classList).not.toContain('Sidebar--collapsed');
      });
    });

    describe('when clicking on the collapse button', () => {
      it('should toggle the sidebar collapsed state', () => {
        const collapseBtn: HTMLElement = fixture.debugElement.query(By.css('.Sidebar__collapse')).nativeElement;
        spyOn(sidebarService, 'toggleCollapse');

        collapseBtn.click();

        expect(sidebarService.toggleCollapse).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the user is cardealer...', () => {
      beforeEach(() => {
        permissionService.addPermission(PERMISSIONS.professional);
        fixture.detectChanges();
      });

      it('should not show the wallet button', () => {
        const walletButton: HTMLElement = fixture.nativeElement.querySelector(walletButtonSelector);

        expect(walletButton).toBeFalsy();
      });

      it('should not show the delivery button', () => {
        const deliveryButton: HTMLElement = fixture.nativeElement.querySelector(deliveryButtonSelector);

        expect(deliveryButton).toBeFalsy();
      });
    });

    describe('when the user is not cardealer...', () => {
      beforeEach(() => {
        permissionService.removePermission(PERMISSIONS.professional);
        fixture.detectChanges();
      });

      it('should show the wallet button', () => {
        const walletButton: HTMLElement = fixture.nativeElement.querySelector(walletButtonSelector);

        expect(walletButton).toBeTruthy();
      });

      it('should show the delivery button', () => {
        const deliveryButton: HTMLElement = fixture.nativeElement.querySelector(deliveryButtonSelector);

        expect(deliveryButton).toBeTruthy();
      });

      describe('and we click on the wallet button', () => {
        it('should redirect to the wallet page', () => {
          const walletURL = `/${PRIVATE_PATHS.WALLET}`;
          const walletButton = fixture.debugElement.query(By.css(walletButtonSelector));

          expect(walletButton.nativeElement.getAttribute('href')).toEqual(walletURL);
        });

        it('should track the event', () => {
          const element: HTMLElement = fixture.nativeElement.querySelector(walletButtonSelector);
          const expectedEvent: AnalyticsEvent<ClickWallet> = {
            name: ANALYTICS_EVENT_NAMES.ClickWallet,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfileMenu,
            },
          };

          element.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and we click on the delivery button', () => {
        it('should redirect to the delivery page', () => {
          const deliveryURL = `/${PRIVATE_PATHS.DELIVERY}`;
          const deliveryButton = fixture.debugElement.query(By.css(deliveryButtonSelector));

          expect(deliveryButton.nativeElement.getAttribute('href')).toEqual(deliveryURL);
        });
      });
    });
  });
});
