import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ACTIVATE_SHIPPING_BANNER_PROPERTIES } from '../../../constants/delivery-banner-configs';

import { ActivateShippingBannerComponent } from './activate-shipping-banner.component';

describe('ActivateShippingBannerComponent', () => {
  let component: ActivateShippingBannerComponent;
  let fixture: ComponentFixture<ActivateShippingBannerComponent>;

  const iconSelector: string = 'tsl-svg-icon';
  const helpLinkSelector: string = 'a';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivateShippingBannerComponent, ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateShippingBannerComponent);
    component = fixture.componentInstance;
    component.bannerProperties = ACTIVATE_SHIPPING_BANNER_PROPERTIES;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when displaying the banner', () => {
    it('should display icon', () => {
      const iconElement: DebugElement = fixture.debugElement.query(By.css(iconSelector));
      const iconSrc: string = iconElement.nativeNode.src;

      expect(iconSrc).toEqual(component.ACTIVATE_SHIPPING_ICON_URL);
    });

    describe('and when user clicks on the help button', () => {
      let helpLinkElement: DebugElement;

      beforeEach(() => {
        helpLinkElement = fixture.debugElement.query(By.css(helpLinkSelector));
      });

      it('should open a new browser tab', () => {
        expect(helpLinkElement.attributes.target).toEqual('_blank');
      });

      it('link should redirect to activate shipping help page', () => {
        expect(helpLinkElement.attributes.href).toEqual(component.ACTIVATE_SHIPPING_HELP_URL);
      });
    });

    describe('and when the user clicks on the CTA', () => {
      beforeEach(() => {
        spyOn(component.clickedCTA, 'emit');
        const buttonElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
        buttonElement.nativeElement.click();
      });

      it('should emit the action', () => {
        expect(component.clickedCTA.emit).toHaveBeenCalledTimes(1);
        expect(component.clickedCTA.emit).toHaveBeenCalledWith(ACTIVATE_SHIPPING_BANNER_PROPERTIES.action);
      });
    });
  });
});
