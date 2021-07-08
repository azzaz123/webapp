import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DeliveryDevelopmentDirective } from './delivery-development.directive';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { of } from 'rxjs';

@Component({
  template: `<span *tslDeliveryDevelopment></span>`,
})
class TestComponent {
  constructor() {}
}

describe('DeliveryDevelopmentDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let featureflagService: FeatureFlagService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeliveryDevelopmentDirective, TestComponent],
        providers: [{ provide: FeatureFlagService, useClass: FeatureFlagServiceMock }, TemplateRef, ViewContainerRef],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    featureflagService = TestBed.inject(FeatureFlagService);
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  describe('when the delivery feature flag have experimental features or is dev mode...', () => {
    it('should show the dom element', () => {
      spyOn(featureflagService, 'getFlag').and.returnValue(of(true));

      fixture.detectChanges();

      const spanElement = fixture.debugElement.query(By.css('span'));
      expect(spanElement).toBeTruthy();
    });
  });

  describe(`when the delivery feature flag don't have experimental features and is not dev mode...`, () => {
    it('should NOT show the dom element', () => {
      spyOn(featureflagService, 'getLocalFlag').and.returnValue(of(false));

      fixture.detectChanges();

      const spanElement = fixture.debugElement.query(By.css('span'));
      expect(spanElement).toBeFalsy();
    });
  });
});
