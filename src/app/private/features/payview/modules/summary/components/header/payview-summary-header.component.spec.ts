import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_ITEM } from '@fixtures/private/delivery/payview/payview-item.fixtures.spec';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewSummaryHeaderComponent', () => {
  const payviewSummaryHeader: string = '.PayviewSummaryHeader';
  const payviewSummaryHeaderImage: string = `${payviewSummaryHeader}__image`;
  const payviewSummaryHeaderDeliveryEta: string = `${payviewSummaryHeader}__deliveryEta`;
  const payviewSummaryHeaderDeliveryEtaWrapper: string = `${payviewSummaryHeader}__deliveryEtaWrapper`;
  const payviewSummaryHeaderDeliveryAddressTitle: string = `${payviewSummaryHeader}__deliveryAddressTitle`;
  const payviewSummaryHeaderDeliveryAddress: string = `${payviewSummaryHeader}__deliveryAddress`;
  const payviewSummaryHeaderDeliveryAddressWrapper: string = `${payviewSummaryHeader}__deliveryAddressWrapper`;

  let component: PayviewSummaryHeaderComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewSummaryHeaderComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewSummaryHeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN there is no delivery method', () => {
    beforeEach(() => {
      component.deliveryMethod = null;
    });

    it('should not show the summary header block', () => {
      const target = debugElement.query(By.css(payviewSummaryHeader));

      expect(target).toBeFalsy();
    });

    it('should not show the summary header image', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderImage));

      expect(target).toBeFalsy();
    });

    it('should not show the summary delivery eta info', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryEta));

      expect(target).toBeFalsy();
    });

    it('should not show the summary delivery address', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddress));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN there is delivery method', () => {
    beforeEach(() => {
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;

      fixture.detectChanges();
    });

    it('should show the summary header block', () => {
      const target = debugElement.query(By.css(payviewSummaryHeader));

      expect(target).toBeTruthy();
    });

    it('should not show the summary delivery eta info', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryEta));

      expect(target).toBeTruthy();
    });

    it('should not show the summary delivery address', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddress));

      expect(target).toBeTruthy();
    });

    it('should show the estimated delivery time', () => {
      const expected: string = `${component.deliveryMethod.deliveryTimes.from}-${component.deliveryMethod.deliveryTimes.to} days`;
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryEta));

      expect(target.nativeElement.innerHTML).toBe(expected);
    });

    it('should show the address', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddress));

      expect(target.nativeElement.innerHTML).toBe(component.deliveryMethod.lastAddressUsed.label);
    });
  });

  describe('WHEN delivery method is the buyer address', () => {
    beforeEach(() => {
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.deliveryMethod.method = DELIVERY_MODE.BUYER_ADDRESS;

      fixture.detectChanges();
    });

    it('should show "Dirección"', () => {
      const expected: string = 'Address: ';
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddressTitle));

      expect(target.nativeElement.innerHTML).toContain(expected);
    });
  });

  describe('WHEN delivery method is carrier office', () => {
    beforeEach(() => {
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.deliveryMethod.method = DELIVERY_MODE.CARRIER_OFFICE;

      fixture.detectChanges();
    });

    it('should show "Punto de recogida:"', () => {
      const expected: string = 'Pick-up point:';
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddressTitle));

      expect(target.nativeElement.innerHTML).toContain(expected);
    });
  });

  describe('WHEN there is image', () => {
    beforeEach(() => {
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.image = MOCK_PAYVIEW_ITEM.mainImage;

      fixture.detectChanges();
    });

    it('should show the corresponding image', () => {
      const image = debugElement.query(By.css(payviewSummaryHeaderImage));

      expect(image).toBeTruthy();
      expect((image.nativeElement as HTMLImageElement).src).toBe(component.image.urls_by_size.small);
    });
  });

  describe('WHEN there is title', () => {
    const fakeTitle: string = 'This_is_a_fake_title';

    beforeEach(() => {
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.image = MOCK_PAYVIEW_ITEM.mainImage;
      component.title = fakeTitle;

      fixture.detectChanges();
    });

    it('should assign the title to the alternate text', () => {
      const image = debugElement.query(By.css(payviewSummaryHeaderImage));

      expect((image.nativeElement as HTMLImageElement).alt).toBe(component.title);
    });
  });

  describe('WHEN there is no delivery times', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewSummaryHeaderComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.deliveryMethod.deliveryTimes = null;

      fixture.detectChanges();
    });

    it('should not show the summary delivery eta block', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryEtaWrapper));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN there is no last delivery address', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewSummaryHeaderComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      component.deliveryMethod.lastAddressUsed = null;

      fixture.detectChanges();
    });

    it('should not show the summary delivery eta block', () => {
      const target = debugElement.query(By.css(payviewSummaryHeaderDeliveryAddressWrapper));

      expect(target).toBeFalsy();
    });
  });
});
