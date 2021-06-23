import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStatsComponent } from './user-stats.component';
import { By } from '@angular/platform-browser';
import { MOCK_FULL_USER_FEATURED, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';

describe('UserStatsComponent', () => {
  const profileUserClass = '.ProfileUser';
  const shippingCounterSelector = '#shippingCounter';

  let component: UserStatsComponent;
  let fixture: ComponentFixture<UserStatsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let router: Router;
  let scrollIntoViewService: ScrollIntoViewService;
  let permissionService: NgxPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PublicPipesModule, NgxPermissionsModule.forRoot()],
      declarations: [UserStatsComponent],
      providers: [
        NgxPermissionsService,
        {
          provide: DeviceDetectorService,
          useValue: {
            isMobile() {
              return false;
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
            url: 'environment/public/user/1234/published',
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatsComponent);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    scrollIntoViewService = TestBed.inject(ScrollIntoViewService);
    permissionService = TestBed.inject(NgxPermissionsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the necessary data...', () => {
    it('should show the content', () => {
      const containerPage = fixture.debugElement.query(By.css(profileUserClass));

      expect(containerPage).toBeTruthy();
    });

    describe('when we click on the location anchor...', () => {
      const expectedURL = 'environment/public/user/1234/info';

      describe('and when our device is NOT a phone', () => {
        it('should redirect to info path...', () => {
          locationSpyAndClick();

          expect(component.showLocation).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([expectedURL]);
        });

        describe('and when our device is a phone', () => {
          it('should redirect to info path', () => {
            const mapSelector = '#map';
            spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
            spyOn(scrollIntoViewService, 'scrollToSelector');
            locationSpyAndClick();

            expect(component.showLocation).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([expectedURL]);

            setTimeout(() => {
              expect(scrollIntoViewService.scrollToSelector).toHaveBeenCalledWith(mapSelector);
            });
          });
        });
      });
    });

    describe('when the user is pro...', () => {
      describe('and has subscriptions permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
        });
        describe('when have the extra info...', () => {
          it('should show three anchors if it have the extra info', () => {
            fixture.detectChanges();
            const errorMessages = fixture.debugElement.queryAll(By.css('a'));

            expect(errorMessages.length).toBe(3);
          });

          it('should toggle the phone when click on the anchor...', () => {
            fixture.detectChanges();
            spyOn(component, 'togglePhone').and.callThrough();
            const phoneAnchor = fixture.debugElement
              .queryAll(By.css('a'))
              .find((anchors) => anchors.nativeElement.innerHTML === 'Show phone number').nativeElement;

            phoneAnchor.click();

            expect(component.togglePhone).toHaveBeenCalledTimes(1);
            expect(component.showPhone).toBe(true);
          });
        });
        describe('when NOT have the extra info', () => {
          it('should show one anchor if it have NOT the extra info', () => {
            component.userInfo.extraInfo.phone_number = null;
            component.userInfo.extraInfo.link = null;

            fixture.detectChanges();
            const errorMessages = fixture.debugElement.queryAll(By.css('a'));

            expect(errorMessages.length).toBe(1);
          });
        });
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should show only one anchor', () => {
          component.userInfo.featured = false;

          fixture.detectChanges();
          const errorMessages = fixture.debugElement.queryAll(By.css('a'));

          expect(errorMessages.length).toBe(1);
        });
      });
    });

    describe('when the user is NOT pro...', () => {
      it('should show only one anchor', () => {
        component.userInfo.featured = false;

        fixture.detectChanges();
        const errorMessages = fixture.debugElement.queryAll(By.css('a'));

        expect(errorMessages.length).toBe(1);
      });
    });

    describe('when loading the counters...', () => {
      it('should show the sale counter', () => {
        const salesCounter = fixture.debugElement.query(By.css('#sellsCounter')).nativeElement.innerHTML;

        expect(salesCounter).toBe(`${component.userStats.counters.sells}`);
      });

      it('should show the purchase counter', () => {
        const salesCounter = fixture.debugElement.query(By.css('#buysCounter')).nativeElement.innerHTML;

        expect(salesCounter).toBe(`${component.userStats.counters.buys}`);
      });

      describe('and the shipping counter is bigger than zero...', () => {
        beforeEach(() => {
          component.userStats.counters.shipping_counter = 1;
          fixture.detectChanges();
        });
        it('should show the shipping counter', () => {
          const shippingCounter = fixture.debugElement.query(By.css(shippingCounterSelector)).nativeElement.innerHTML;

          expect(shippingCounter).toBe(`${component.userStats.counters.shipping_counter}`);
        });
      });

      describe('and the shipping counter is smaller than one...', () => {
        beforeEach(() => {
          component.userStats.counters.shipping_counter = 0;
          fixture.detectChanges();
        });
        it('should NOT show the shipping counter', () => {
          const shippingCounter = fixture.debugElement.query(By.css(shippingCounterSelector));

          expect(shippingCounter).toBeFalsy();
        });
      });
    });
  });

  describe('when we NOT have the necessary data...', () => {
    it('should NOT show the content', () => {
      component.userStats = null;

      fixture.detectChanges();
      const containerPage = fixture.debugElement.query(By.css(profileUserClass));

      expect(containerPage).toBeFalsy();
    });
  });

  function locationSpyAndClick() {
    spyOn(router, 'navigate');
    spyOn(component, 'showLocation').and.callThrough();
    const locationAnchor = fixture.debugElement.queryAll(By.css('a')).find((anchors) => anchors.nativeElement.innerHTML === 'View location')
      .nativeElement;

    locationAnchor.click();
  }
});
