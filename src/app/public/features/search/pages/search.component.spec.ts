import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { random } from 'faker';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchComponent } from './search.component';

describe('WallComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;

  beforeEach(
    waitForAsync(() => {
      deviceServiceMock = {
        getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      };
      TestBed.configureTestingModule({
        declarations: [SearchComponent, AdComponentStub],
        providers: [
          {
            provide: AdsService,
            useValue: MockAdsService,
          },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
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
    describe('...when is desktop', () => {
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
