import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../../../constants/delivery-banner-configs';

import { EditPriceBannerComponent } from './edit-price-banner.component';

describe('EditPriceBannerComponent', () => {
  let component: EditPriceBannerComponent;
  let fixture: ComponentFixture<EditPriceBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPriceBannerComponent, ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceBannerComponent);
    component = fixture.componentInstance;
    component.bannerProperties = SELLER_EDIT_PRICE_BANNER_PROPERTIES;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and when the user clicks on the CTA', () => {
    beforeEach(() => {
      spyOn(component.clickedCTA, 'emit');
      const buttonElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
      buttonElement.nativeElement.click();
    });

    it('should emit the action', () => {
      expect(component.clickedCTA.emit).toHaveBeenCalledTimes(1);
      expect(component.clickedCTA.emit).toHaveBeenCalledWith(SELLER_EDIT_PRICE_BANNER_PROPERTIES.action);
    });
  });
});
