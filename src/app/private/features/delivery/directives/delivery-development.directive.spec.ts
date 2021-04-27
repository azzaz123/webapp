import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DeliveryDevelopmentDirective } from './delivery-development.directive';
import { FeatureflagService } from '@core/user/featureflag.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';

@Component({
  template: `<span *tslDeliveryDevelopment></span>`,
})
class TestComponent {
  constructor() {}
}

describe('DeliveryDevelopmentDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let featureflagService: FeatureflagService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeliveryDevelopmentDirective, TestComponent],
        providers: [TemplateRef, ViewContainerRef, FeatureFlagServiceMock],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    featureflagService = TestBed.inject(FeatureflagService);
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  describe('when the delivery feature flag have experimental features or is dev mode...', () => {
    it('should show the dom element', () => {
      spyOn(featureflagService, 'getDeliveryFeatureFlag').and.returnValue(true);

      fixture.detectChanges();

      const spanElement = fixture.debugElement.query(By.css('span'));
      expect(spanElement).toBeTruthy();
    });
  });

  describe(`when the delivery feature flag don't have experimental features and is not dev mode...`, () => {
    it('should NOT show the dom element', () => {
      spyOn(featureflagService, 'getDeliveryFeatureFlag').and.returnValue(false);

      fixture.detectChanges();

      const spanElement = fixture.debugElement.query(By.css('span'));
      expect(spanElement).toBeFalsy();
    });
  });
});
