import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_ACTIONABLE_DELIVERY_BANNER,
  MOCK_DELIVERY_BANNER,
  MOCK_DESCRIPTIVE_DELIVERY_BANNER,
} from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';

import { DeliveryBannerComponent } from './delivery-banner.component';

@Component({
  selector: 'tsl-test-wrapper-delivery-banner',
  template: '<tsl-delivery-banner [bannerProperties]="bannerProperties" (clickedCTA)="clickedCTA($event)"></tsl-delivery-banner>',
})
class TestWrapperDeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner = MOCK_DELIVERY_BANNER;
  clickedCTA(_actionType: DELIVERY_BANNER_ACTION): void {}
}

describe('DeliveryBannerComponent', () => {
  let component: TestWrapperDeliveryBannerComponent;
  let fixture: ComponentFixture<TestWrapperDeliveryBannerComponent>;

  const buttonSelector: string = 'tsl-button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestWrapperDeliveryBannerComponent, DeliveryBannerComponent, SvgIconComponent, BannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperDeliveryBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when displaying the delivery banner', () => {
    beforeEach(() => {
      component.bannerProperties = MOCK_DELIVERY_BANNER;
      fixture.detectChanges();
    });

    it('should display content wrapped in info banner', () => {
      const bannerElement: DebugElement = fixture.debugElement.query(By.css('tsl-banner'));

      expect(bannerElement.componentInstance.specifications.type).toEqual('info');
    });

    it('should display the icon with valid icon URL', () => {
      const iconElement: DebugElement = fixture.debugElement.query(By.directive(SvgIconComponent));

      expect(iconElement.componentInstance.src).toEqual(MOCK_DELIVERY_BANNER.svgPath);
    });

    it('should display the text from the description', () => {
      const descriptionTextElement: DebugElement = fixture.debugElement.query(By.css('p'));

      expect(descriptionTextElement.nativeElement.innerHTML).toEqual(MOCK_DELIVERY_BANNER.description.text);
    });

    it('should NOT display help link', () => {
      const linkElement: DebugElement = fixture.debugElement.query(By.css('a'));

      expect(linkElement).toBeFalsy();
    });

    it('should NOT display CTA button', () => {
      const buttonElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));

      expect(buttonElement).toBeFalsy();
    });

    describe('and when the banner is descriptive', () => {
      beforeEach(() => {
        component.bannerProperties = MOCK_DESCRIPTIVE_DELIVERY_BANNER;
        fixture.detectChanges();
      });

      it('should show a link with help for the user', () => {
        const linkElement: DebugElement = fixture.debugElement.query(By.css('a'));

        expect(linkElement.nativeElement.href).toEqual(MOCK_DESCRIPTIVE_DELIVERY_BANNER.description.helpLink);
      });
    });

    describe('and when the banner has a CTA action', () => {
      beforeEach(() => {
        component.bannerProperties = MOCK_ACTIONABLE_DELIVERY_BANNER;
        fixture.detectChanges();
      });

      it('should display a button with the action text', () => {
        const buttonElement: DebugElement = fixture.debugElement.query(By.css(buttonSelector));

        expect(buttonElement.nativeElement.innerHTML).toEqual(MOCK_ACTIONABLE_DELIVERY_BANNER.action.label);
      });

      describe('and when the user clicks on the CTA', () => {
        beforeEach(() => {
          spyOn(component, 'clickedCTA');

          const buttonElement: DebugElement = fixture.debugElement.query(By.css(buttonSelector));
          buttonElement.nativeElement.click();
        });

        it('should emit the action', () => {
          expect(component.clickedCTA).toHaveBeenCalledTimes(1);
          expect(component.clickedCTA).toHaveBeenCalledWith(MOCK_ACTIONABLE_DELIVERY_BANNER.action.type);
        });
      });
    });
  });
});
