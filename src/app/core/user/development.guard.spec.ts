import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { DevelopmentGuard } from './development.guard';
import { FeatureflagService } from './featureflag.service';

describe('DevelopmentGuard', (): void => {
  let developmentGuard: DevelopmentGuard;
  let featureFlagService: FeatureflagService;
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
        FeatureFlagServiceMock,
      ],
    });

    developmentGuard = TestBed.inject(DevelopmentGuard);
    featureFlagService = TestBed.inject(FeatureflagService);
    router = TestBed.inject(Router);
  });

  it('should create an instance', (): void => {
    expect(developmentGuard).toBeTruthy();
  });

  describe('canLoad', (): void => {
    describe('when we are on dev mode...', () => {
      it('should return true', () => {
        spyOn(featureFlagService, 'isExpermientalFeaturesEnabled').and.returnValue(false);

        expect(developmentGuard.canLoad()).toBe(true);
      });
    });

    describe('when the experimental features are enabled...', () => {
      it('should return true', () => {
        spyOn(featureFlagService, 'isExpermientalFeaturesEnabled').and.returnValue(true);

        expect(developmentGuard.canLoad()).toBe(true);
      });
    });

    describe('when the experimental features are not enabled and is not dev mode...', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'isExpermientalFeaturesEnabled').and.returnValue(false);
        spyOn(router, 'navigate');
      });

      it('should redirect to the chat', () => {
        expect(router.navigate).toHaveBeenCalledWith(['/chat']);
      });

      it('should return false', () => {
        expect(developmentGuard.canLoad()).toBe(false);
      });
    });
  });
});
