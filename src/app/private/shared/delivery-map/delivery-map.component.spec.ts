import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMapComponent } from './delivery-map.component';
import { DeliveryMapService } from './delivery-map.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@core/user/user.service';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';
import { ErrorsService } from '@core/errors/errors.service';
import { By } from '@angular/platform-browser';
import { SearchableMovableMapComponent } from '../searchable-movable-map/searchable-movable-map.component';
import { MOCK_ACCEPT_SCREEN_PROPERTIES } from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { of } from 'rxjs';
import { CoordinateMother } from '@fixtures/core/geolocation/coordinate.mother';
import { DeliveryMapModule } from './delivery-map.module';
import { MOCK_CARRIERS_OFFICE_INFO } from '@fixtures/private/delivery/carrier-office-info/carrier-office-info.fixtures.spec';

describe('DeliveryMapComponent', () => {
  const MOCK_COORDINATE = CoordinateMother.random();

  let component: DeliveryMapComponent;
  let deliveryMapService: DeliveryMapService;
  let fixture: ComponentFixture<DeliveryMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DeliveryMapModule],
      declarations: [DeliveryMapComponent],
      providers: [
        ErrorsService,
        I18nService,
        UserService,
        {
          provide: DeliveryMapService,
          useValue: {
            initializeOffices() {
              return of(MOCK_CARRIERS_OFFICE_INFO);
            },
            initialCenterLocation$() {
              return of(MOCK_COORDINATE);
            },
          },
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            get(key) {
              return this.cookies[key];
            },
            put(key, value) {
              this.cookies[key] = value;
            },
            remove(key) {
              delete this.cookies[key];
            },
          },
        },
        {
          provide: NgxPermissionsService,
          useValue: {
            addPermission() {},
            flushPermissions() {},
            hasPermission() {},
          },
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    deliveryMapService = TestBed.inject(DeliveryMapService);
    fixture = TestBed.createComponent(DeliveryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the delivery map initializes... ', () => {
    describe('and there is an address with a selected carrier', () => {
      beforeEach(() => {
        const MOCK_FULL_ADDRESS_CHANGED = { fullAddress: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress } as any;
        component.fullAddress = MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress;
        component.selectedCarrier = POST_OFFICE_CARRIER.SEUR;
        spyOn(deliveryMapService, 'initializeOffices$').and.callThrough();
        spyOn(deliveryMapService, 'initialCenterLocation$').and.callThrough();
        component.ngOnChanges(MOCK_FULL_ADDRESS_CHANGED);
      });

      it('should call the delivery map service to initialize offices', () => {
        expect(deliveryMapService.initializeOffices$).toHaveBeenCalledTimes(1);
        expect(deliveryMapService.initializeOffices$).toBeCalledWith(
          MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress,
          POST_OFFICE_CARRIER.SEUR
        );
      });

      it('should call the delivery map service to initialize center coordinates', () => {
        expect(deliveryMapService.initialCenterLocation$).toHaveBeenCalledTimes(1);
        expect(deliveryMapService.initialCenterLocation$).toBeCalledWith(MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress);
      });

      it('should render the searchable movable map', () => {
        expect(fixture.debugElement.query(By.directive(SearchableMovableMapComponent))).toBeTruthy();
      });
    });
  });
});
