import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { random } from 'faker';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchComponent } from './search.component';
import { SearchStoreService } from '../core/services/search-store.service';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { ViewportService } from '@core/viewport/viewport.service';
import { of } from 'rxjs/internal/observable/of';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { CoreModule } from '@core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AdComponentStub } from '@tests/shared';
import { Store } from '@ngrx/store';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;
  let storeMock;

  beforeEach(
    waitForAsync(() => {
      deviceServiceMock = {
        getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      };
      storeMock = {
        select: () => of(),
        dispatch: () => {},
      };
      TestBed.configureTestingModule({
        imports: [CoreModule, ItemCardListModule, HttpClientTestingModule, CheckSessionModule, RouterTestingModule],
        declarations: [SearchComponent, SearchLayoutComponent, AdComponentStub],
        providers: [
          SearchStoreService,
          {
            provide: Store,
            useValue: storeMock,
          },
          { provide: DeviceDetectorService, useValue: { isMobile: () => false } },
          { provide: ViewportService, useValue: { onViewportChange: of('') } },
          {
            provide: AdsService,
            useValue: MockAdsService,
          },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
          { provide: 'SUBDOMAIN', useValue: 'es' },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component init', () => {
    describe('when is desktop', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      });
      it('should configure ads', () => {
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.setSlots).toHaveBeenCalledWith([
          AD_PUBLIC_SEARCH.search1,
          AD_PUBLIC_SEARCH.search2r,
          AD_PUBLIC_SEARCH.search3r,
        ]);
      });
    });
  });
});
