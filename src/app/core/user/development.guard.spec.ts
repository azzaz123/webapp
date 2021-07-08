import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { DevelopmentGuard } from './development.guard';
import { FeatureFlagService } from './featureflag.service';
import * as coreLibrary from '@angular/core';

const isDevMode = jasmine.createSpy().and.returnValue(true);

Object.defineProperty(coreLibrary, 'isDevMode', {
  value: isDevMode,
});

describe('DevelopmentGuard', (): void => {
  let developmentGuard: DevelopmentGuard;
  let featureFlagService: FeatureFlagService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
      ],
    });

    developmentGuard = TestBed.inject(DevelopmentGuard);
    featureFlagService = TestBed.inject(FeatureFlagService);
    router = TestBed.inject(Router);
  });

  it('should create an instance', (): void => {
    expect(developmentGuard).toBeTruthy();
  });

  describe('canLoad', (): void => {
    describe('when we are on dev mode...', () => {
      it('should return true', () => {
        spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(false);
        isDevMode.and.returnValue(true);

        expect(developmentGuard.canLoad()).toBe(true);
      });
    });

    describe('when the experimental features are enabled...', () => {
      it('should return true', () => {
        spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(true);
        isDevMode.and.returnValue(false);

        expect(developmentGuard.canLoad()).toBe(true);
      });
    });

    describe('when the experimental features are not enabled and is not dev mode...', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(false);
        spyOn(router, 'navigate');
        isDevMode.and.returnValue(false);
      });

      it('should redirect to the chat', () => {
        developmentGuard.canLoad();

        expect(router.navigate).toHaveBeenCalledWith(['/chat']);
      });

      it('should return false', () => {
        expect(developmentGuard.canLoad()).toBe(false);
      });
    });
  });
});
