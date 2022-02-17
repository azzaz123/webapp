import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryPointsComponent', () => {
  let component: PayviewDeliveryPointsComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryPointsComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
