import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '../delivery-routing-constants';

import { DeliveryComponent } from './delivery.component';

describe('DeliveryComponent', () => {
  const URL = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.MY_SHIPPINGS}`;
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DeliveryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user navigates through the nav links...', () => {
    it('should navigate to the specified URL', () => {
      const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
      spyOn(router, 'navigate');

      navLinksElement.triggerEventHandler('clickedLink', URL);

      expect(router.navigate).toHaveBeenCalledWith([URL]);
    });
  });
});
