import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BannerComponent } from '@shared/banner/banner.component';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KYC_BANNER_TYPES } from './kyc-banner-constants';
import { KycBannerComponent } from './kyc-banner.component';

describe('KycBannerComponent', () => {
  const MOCK_KYC_BANNER_SPECIFICATIONS = KYC_BANNER_TYPES[0];
  let component: KycBannerComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<KycBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycBannerComponent, BannerComponent, SvgIconComponent],
      imports: [SvgIconModule, ButtonModule, HttpClientTestingModule, BannerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycBannerComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('when we do not specify the banner specifications...', () => {
    beforeEach(() => {
      component.KYCBannerSpecifications = null;

      fixture.detectChanges();
    });

    it('should not show the kyc banner', () => {
      const banner = debugElement.query(By.directive(BannerComponent));

      expect(banner).toBeFalsy();
    });
  });

  describe('when we specify the KYC banner specifications', () => {
    beforeEach(() => {
      component.KYCBannerSpecifications = MOCK_KYC_BANNER_SPECIFICATIONS;

      fixture.detectChanges();
    });

    it('should show the kyc banner', () => {
      const banner = debugElement.query(By.directive(BannerComponent));

      expect(banner).toBeTruthy();
    });

    it('should get the correct alert specifications', () => {
      expect(component.ngbAlertConfiguration).toStrictEqual({
        dismissible: MOCK_KYC_BANNER_SPECIFICATIONS.dismissible,
        type: MOCK_KYC_BANNER_SPECIFICATIONS.type,
      });
    });

    it('should show the svg', () => {
      const icon = debugElement.query(By.directive(SvgIconComponent));

      expect(icon).toBeTruthy();
    });

    it('should show the specified button text', () => {
      const button: HTMLElement = debugElement.query(By.directive(ButtonComponent)).nativeElement;

      expect(button.textContent).toEqual(component.KYCBannerSpecifications.buttonText);
    });
  });
});