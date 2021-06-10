import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { RouterLinkDirectiveStub } from 'app/shared/router-link-directive-stub';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { SidebarComponent } from './sidebar.component';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewOwnSaleItems } from '@core/analytics/analytics-constants';

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarComponent, RouterLinkDirectiveStub, MockComponent],
        imports: [NgxPermissionsModule.forRoot(), RouterTestingModule.withRoutes(routes)],
        providers: [
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
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
            },
          },
          {
            provide: UnreadChatMessagesService,
            useValue: {
              totalUnreadMessages$: of(1),
            },
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
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
    spyOn(analyticsService, 'trackPageView');
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
    it('should be shown profile icon as "active" when is in a profile section', () => {
      component.isProfile = true;
      const element: HTMLElement = fixture.nativeElement.querySelector('#qa-sidebar-profile');

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });

    it('should be shown profile icon as "active" when is in profile url route', fakeAsync(() => {
      fixture.ngZone.run(() => {
        component.isProfile = false;
        router.navigate(['profile']);

        tick();
        var activeLinks = fixture.debugElement
          .queryAll(By.css('.active'))
          .map((element) => element.injector.get(RouterLinkDirectiveStub) as RouterLinkDirectiveStub);

        expect(activeLinks.length).toBe(1);
        expect(activeLinks[0].linkParams).toEqual(['/profile']);
      });
    }));

    it('should be shown catalog icon as "active" when it is in a product section', () => {
      component.isProducts = true;
      const element: HTMLElement = fixture.nativeElement.querySelector('#qa-sidebar-catalog');

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });

    it('should be shown chat icon as "active" when is in chat url route', fakeAsync(() => {
      fixture.ngZone.run(() => {
        router.navigate(['chat']);

        tick();
        var activeLinks = fixture.debugElement
          .queryAll(By.css('.active'))
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
            const element: HTMLElement = fixture.nativeElement.querySelector('#qa-sidebar-catalog');
            const expectedEvent: AnalyticsPageView<ViewOwnSaleItems> = {
              name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
              attributes: {
                screenId: SCREEN_IDS.MyCatalog,
                numberOfItems: mockCounters.publish,
                proSubscriptionBanner: false,
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
            const element: HTMLElement = fixture.nativeElement.querySelector('#qa-sidebar-catalog');
            const expectedEvent: AnalyticsPageView<ViewOwnSaleItems> = {
              name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
              attributes: {
                screenId: SCREEN_IDS.MyCatalog,
                numberOfItems: mockCounters.publish,
                proSubscriptionBanner: true,
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
          const element: HTMLElement = fixture.nativeElement.querySelector('#qa-sidebar-catalog');

          element.click();

          expect(analyticsService.trackPageView).not.toHaveBeenCalled();
        });
      });
    });
  });
});
