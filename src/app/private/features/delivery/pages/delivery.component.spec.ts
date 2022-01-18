import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { DeliveryComponent, LOCAL_STORAGE_TRX_AWARENESS } from '@private/features/delivery/pages/delivery.component';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { NavLinksComponent } from '@shared/nav-links/nav-links.component';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { UserService } from '@core/user/user.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { NO_NAV_LINK_SELECTED, DELIVERY_TRACKING_PATH } from './delivery.component';

describe('DeliveryComponent', () => {
  const FAKE_DATE_NOW = 1627743615459;
  const BUYS_URL = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
  const SELLS_URL = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}`;
  const ADDRESS_URL = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`;
  const TRACKING_URL: string = DELIVERY_TRACKING_PATH;
  const routerEvents: Subject<any> = new Subject();

  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let router: Router;
  let userService: UserService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgbModalModule],
      declarations: [DeliveryComponent, NavLinksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: UserService,
          useValue: {
            getLocalStore() {},
            saveLocalStore() {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate(): void {},
            events: routerEvents,
            get url(): string {
              return '';
            },
          },
        },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    modalService = TestBed.inject(NgbModal);

    spyOn(Date, 'now').and.returnValue(FAKE_DATE_NOW);
    spyOn(userService, 'saveLocalStore');
    spyOn(modalService, 'open').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the url changes', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('and matchs the default url', () => {
      it('should redirect to the default route', fakeAsync(() => {
        tick();
        routerEvents.next(new NavigationEnd(1, ADDRESS_URL, ''));

        expect(component.selectedNavLinkId).toStrictEqual(ADDRESS_URL);
      }));
    });

    describe('and matches the tracking url', () => {
      it('should not select any nav link', fakeAsync(() => {
        tick();
        routerEvents.next(new NavigationEnd(1, TRACKING_URL, ''));

        expect(component.selectedNavLinkId).toStrictEqual(NO_NAV_LINK_SELECTED);
      }));
    });

    describe('and NOT matchs the default url', () => {
      it('should redirect to the new url provided', fakeAsync(() => {
        tick();
        routerEvents.next(new NavigationEnd(1, SELLS_URL, ''));

        expect(component.selectedNavLinkId).toStrictEqual(SELLS_URL);
      }));
    });
  });

  describe('when the user enters the page', () => {
    beforeEach(fakeAsync(() => {
      routerEvents.next(new NavigationEnd(1, BUYS_URL, ''));
      tick();
      fixture.detectChanges();
    }));

    it('should show all nav links', () => {
      const navLinks = fixture.debugElement.query(By.directive(NavLinksComponent)).componentInstance.navLinks;
      const navLinksWithStreamline: NavLink[] = [
        {
          id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`,
          display: $localize`:@@web_purchases:Purchases`,
        },
        {
          id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}`,
          display: $localize`:@@web_sales:Sales`,
        },
        {
          id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.COMPLETED}`,
          display: $localize`:@@purchases_view_finished_tab_title:Completed`,
        },
        {
          id: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
          display: $localize`:@@web_delivery_shipping_address:Address`,
        },
      ];

      expect(navLinks).toStrictEqual(navLinksWithStreamline);
    });

    it('should select the nav link option that matchs the url', () => {
      expect(component.selectedNavLinkId).toStrictEqual(BUYS_URL);
    });
  });

  describe('when the user navigates through the nav links...', () => {
    it('should navigate to the specified URL', () => {
      const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
      spyOn(router, 'navigate');

      navLinksElement.triggerEventHandler('clickedLink', BUYS_URL);

      expect(router.navigate).toHaveBeenCalledWith([BUYS_URL]);
    });
  });

  describe('when we click the help button', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css('a')).nativeElement.click();
    });

    it('should open the TRX Awareness Modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });

    it('should NOT save the user view in the local store', () => {
      expect(userService.saveLocalStore).not.toHaveBeenCalled();
    });
  });

  describe('when the user has not previously viewed the TRX Awareness Modal', () => {
    beforeEach(() => {
      spyOn(userService, 'getLocalStore').and.returnValue(false);

      fixture.detectChanges();
    });

    it('should open the TRX Awareness Modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });

    it('should save the user view in the local store', () => {
      expect(userService.saveLocalStore).toHaveBeenCalledTimes(1);
      expect(userService.saveLocalStore).toHaveBeenCalledWith(LOCAL_STORAGE_TRX_AWARENESS, FAKE_DATE_NOW.toString());
    });
  });

  describe('when the user has previously viewed the TRX Awareness Modal', () => {
    beforeEach(() => {
      spyOn(userService, 'getLocalStore').and.returnValue(true);

      fixture.detectChanges();
    });

    it('should NOT open the TRX Awareness Modal', () => {
      expect(modalService.open).not.toHaveBeenCalled();
    });

    it('should NOT save the user view in the local store', () => {
      expect(userService.saveLocalStore).not.toHaveBeenCalled();
    });
  });
});
