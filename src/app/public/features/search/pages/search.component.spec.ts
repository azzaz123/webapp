import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { AD_TOP_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchComponent } from './search.component';

describe('WallComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SearchComponent, AdComponentStub],
        providers: [
          {
            provide: AdsService,
            useValue: MockAdsService,
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
    it('should configure ads', () => {
      spyOn(MockAdsService, 'setSlots').and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      expect(MockAdsService.setSlots).toHaveBeenCalledWith([AD_TOP_PUBLIC_SEARCH.top]);
    });
  });
});
