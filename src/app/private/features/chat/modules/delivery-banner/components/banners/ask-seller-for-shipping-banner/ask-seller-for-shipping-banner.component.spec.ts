import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AskSellerForShippingBannerComponent } from './ask-seller-for-shipping-banner.component';

describe('AskSellerForShippingBannerComponent', () => {
  let component: AskSellerForShippingBannerComponent;
  let fixture: ComponentFixture<AskSellerForShippingBannerComponent>;

  const iconSelector: string = 'tsl-svg-icon';
  const textSelector: string = 'p';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AskSellerForShippingBannerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskSellerForShippingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when displaying the banner', () => {
    it('should display icon', () => {
      const iconElement: DebugElement = fixture.debugElement.query(By.css(iconSelector));
      const iconSrc: string = iconElement.nativeNode.src;

      expect(iconSrc).toEqual(component.iconPath);
    });

    it('should display text', () => {
      const textElement: DebugElement = fixture.debugElement.query(By.css(textSelector));

      expect(textElement).toBeTruthy();
    });
  });
});
