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

describe('DeliveryMapComponent', () => {
  let component: DeliveryMapComponent;
  let deliveryMapService: DeliveryMapService;
  let fixture: ComponentFixture<DeliveryMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DeliveryMapComponent],
      providers: [
        ErrorsService,
        I18nService,
        UserService,
        DeliveryMapService,
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
});
