import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LottieService } from '@core/lottie/lottie.service';
import { MockLottiePlayer, MockLottieService } from '@fixtures/lottie.fixtures.spec';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { AnimationEventName } from 'lottie-web';

import { LottieComponent } from './lottie.component';

const mockLottiePlayer = new MockLottiePlayer();

describe('LottieComponent', () => {
  let component: LottieComponent;
  let fixture: ComponentFixture<LottieComponent>;
  let debugElement: DebugElement;

  const lottieContainerSelector = `.${MockLottiePlayer.MOCK_LOTTIE_CONTAINER_CLASS}`;
  const mockLottieSrc = 'https://www.lotoflotties.com/alotof.json';
  const mockTriggerEventLogic = (animationEventName: AnimationEventName) => {
    mockLottiePlayer.triggerEvent(animationEventName);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIconModule, HttpClientTestingModule],
      providers: [{ provide: LottieService, useValue: MockLottieService(mockLottiePlayer) }],
      declarations: [LottieComponent],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(LottieComponent);
    component = fixture.componentInstance;
    component.src = mockLottieSrc;
    debugElement = fixture.debugElement;
    spyOn(mockLottiePlayer, 'loadAnimation').and.callThrough();

    fixture.detectChanges();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when drawing a Lottie', () => {
    afterEach(() => (mockLottiePlayer.eventQueue = []));

    it('should ask library with correct configuration', () => {
      const container = document.createElement('div');
      container.setAttribute('class', MockLottiePlayer.MOCK_LOTTIE_CONTAINER_CLASS);

      const expectedConfig = {
        container,
        loop: component.loop,
        path: '//www.lotoflotties.com/alotof.json',
        renderer: 'svg',
      };

      expect(mockLottiePlayer.loadAnimation).toHaveBeenCalledWith(expectedConfig);
    });

    describe('and while loading', () => {
      it('should show only the spinner', () => {
        const svgIcons = debugElement.queryAll(By.directive(SvgIconComponent));

        expect(svgIcons.length).toBe(1);
        expect(svgIcons[0].componentInstance.src).toBe(component.loadingIconSrc);
      });
    });

    describe('and when library could load the Lottie', () => {
      beforeEach(() => mockTriggerEventLogic('data_ready'));

      it('should not show the spinner nor the error icon', () => {
        const svgIcons = debugElement.queryAll(By.directive(SvgIconComponent));

        expect(svgIcons.length).toBe(0);
      });

      it('should show the Lottie', () => {
        const lottieContainer = debugElement.queryAll(By.css(lottieContainerSelector));

        expect(lottieContainer).toBeTruthy();
      });
    });

    describe('and when library could not load the Lottie', () => {
      beforeEach(() => mockTriggerEventLogic('data_failed'));

      it('should show only the error fallback image', () => {
        const svgIcons = debugElement.queryAll(By.directive(SvgIconComponent));

        expect(svgIcons.length).toBe(1);
        expect(svgIcons[0].componentInstance.src).toBe(component.fallbackIconSrc);
      });
    });

    describe('and when library encounters an error (e.g.: Lottie has invalid format)', () => {
      beforeEach(() => mockTriggerEventLogic('error'));

      it('should show only the error fallback image', () => {
        const svgIcons = debugElement.queryAll(By.directive(SvgIconComponent));

        expect(svgIcons.length).toBe(1);
        expect(svgIcons[0].componentInstance.src).toBe(component.fallbackIconSrc);
      });
    });

    describe('and when removing element from browser', () => {
      it('should remove Lottie animation from browser', fakeAsync(() => {
        let wasAnimationDestroyed = false;

        mockLottiePlayer.animationDestroyed$.subscribe(() => (wasAnimationDestroyed = true));
        component.ngOnDestroy();

        expect(wasAnimationDestroyed).toBe(true);
      }));
    });
  });
});
