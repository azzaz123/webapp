import { AdSlotGroupDirective } from './ad-slot-group.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import spyOn = jest.spyOn;
import { AdSlotModule } from '@shared/ads/ad-slot/ad-slot.module';

const immediateAdSlot: AdSlotConfiguration = {
  id: 'slot',
  name: 'slot',
  device: [],
  networkId: 0,
  sizes: [],
};

const unrenderedAdSlot: AdSlotConfiguration = {
  id: 'unrendered-slot',
  name: 'unrendered-slot',
  device: [],
  networkId: 0,
  sizes: [],
};

const innerAdSlot: AdSlotConfiguration = {
  id: 'inner-slot',
  name: 'inner-slot',
  device: [],
  networkId: 0,
  sizes: [],
};

@Component({
  selector: 'tsl-test-component',
  template: ` <div tslAdSlotGroup>
    <tsl-sky [adSlot]="adSlot"></tsl-sky>
    <tsl-sky *ngIf="false" [adSlot]="unrenderedAdSlot"></tsl-sky>
    <tsl-inner-test-component>
      <tsl-sky [adSlot]="innerAdSlot"></tsl-sky>
    </tsl-inner-test-component>
  </div>`,
})
class TestComponent {
  public adSlot: AdSlotConfiguration = immediateAdSlot;
  public innerAdSlot: AdSlotConfiguration = innerAdSlot;
  public unrenderedAdSlot: AdSlotConfiguration = unrenderedAdSlot;
}

@Component({
  selector: 'tsl-inner-test-component',
  template: '<ng-content></ng-content>',
})
class InnerTestComponent {}

describe('AdSlotGroupDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let adsService: AdsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotGroupDirective, TestComponent, InnerTestComponent],
        providers: [{ provide: AdsService, useValue: MockAdsService }],
        imports: [AdSlotModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    adsService = TestBed.inject(AdsService);
  });

  it('should set slots ONLY to rendered slots', () => {
    spyOn(adsService, 'setSlots');
    fixture.detectChanges();

    expect(adsService.setSlots).toHaveBeenCalledTimes(1);
    expect(adsService.setSlots).toHaveBeenCalledWith([immediateAdSlot, innerAdSlot]);
  });

  it('should ask to display ONLY the first rendered slot in the group', () => {
    spyOn(adsService, 'displayAdBySlotId');
    fixture.detectChanges();

    expect(adsService.displayAdBySlotId).toHaveBeenCalledTimes(1);
    expect(adsService.displayAdBySlotId).toHaveBeenCalledWith(immediateAdSlot.id);
  });
});
