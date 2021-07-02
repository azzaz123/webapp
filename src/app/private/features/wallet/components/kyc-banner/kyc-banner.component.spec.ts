import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYC_BANNER_TYPES } from './kyc-banner-constants';
import { KycBannerComponent } from './kyc-banner.component';

describe('KycBannerComponent', () => {
  let component: KycBannerComponent;
  let fixture: ComponentFixture<KycBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycBannerComponent],
      imports: [SvgIconModule, ButtonModule, HttpClientTestingModule, BannerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycBannerComponent);
    component = fixture.componentInstance;
    component.KYCBannerSpecifications = KYC_BANNER_TYPES[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we specify the KYC banner specifications', () => {
    it('should get the correct banner specifications', () => {});
    it('should show the specified svg', () => {});
    it('should show the specified description', () => {});
    it('should show the specified button text', () => {});
  });
});
