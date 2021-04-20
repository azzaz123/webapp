import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockedUserService, MOCK_OTHER_USER, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { PublicProfileTrackingEventsService } from './public-profile-tracking-events.service';
import {
  MOCK_VIEW_OTHER_PROFILE_EVENT,
  MOCK_VIEW_OWN_PROFILE_EVENT,
  MOCK_FAVOURITE_USER_EVENT,
  MOCK_UNFAVOURITE_USER_EVENT,
  MOCK_TRACK_VIEW_OWN_REVIEWS,
  MOCK_TRACK_VIEW_OTHERS_REVIEWS,
} from './public-profile-tracking-events.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MOCK_REVIEWS } from '@fixtures/review.fixtures.spec';

describe('PublicProfileTrackingEventsService', () => {
  let service: PublicProfileTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PublicProfileTrackingEventsService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: UserService, useClass: MockedUserService },
      ],
    });
    service = TestBed.inject(PublicProfileTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user views their own profile', () => {
    it('should send track view own item detail event', () => {
      spyOn(service, 'trackViewOwnProfile').and.callThrough();
      spyOn(analyticsService, 'trackPageView');

      service.trackViewOwnProfile(MOCK_USER.featured);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_OWN_PROFILE_EVENT);
    });
  });

  describe('when user views other profile', () => {
    it('should send track view own item detail event', () => {
      spyOn(service, 'trackViewOtherProfile').and.callThrough();
      spyOn(analyticsService, 'trackPageView');

      service.trackViewOtherProfile(MOCK_OTHER_USER, MOCK_USER_STATS.counters.publish);

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_OTHER_PROFILE_EVENT);
    });
  });

  describe('when user toggle favourite user icon...', () => {
    beforeEach(() => {
      spyOn(service, 'trackFavouriteOrUnfavouriteUserEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });
    it('should send favourite user event when user is favourited', () => {
      service.trackFavouriteOrUnfavouriteUserEvent(MOCK_OTHER_USER, true);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_FAVOURITE_USER_EVENT);
    });
    it('should send favourite user event when user is unfavourited', () => {
      service.trackFavouriteOrUnfavouriteUserEvent(MOCK_OTHER_USER, false);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_UNFAVOURITE_USER_EVENT);
    });
  });

  describe('when user view reviews...', () => {
    let isOwnUser: boolean = true;
    beforeEach(() => {
      spyOn(service, 'trackViewOwnReviewsorViewOtherReviews').and.callThrough();
      spyOn(analyticsService, 'trackPageView');
    });
    it('should send view own review event if it is own user review', () => {
      service.trackViewOwnReviewsorViewOtherReviews(MOCK_USER, MOCK_USER_STATS, MOCK_REVIEWS, isOwnUser);

      expect(analyticsService.trackPageView).toHaveBeenLastCalledWith(MOCK_TRACK_VIEW_OWN_REVIEWS);
    });

    it('should send view other reviews event if it is other user review', () => {
      isOwnUser = false;
      service.trackViewOwnReviewsorViewOtherReviews(MOCK_OTHER_USER, MOCK_USER_STATS, MOCK_REVIEWS, isOwnUser);

      expect(analyticsService.trackPageView).toHaveBeenLastCalledWith(MOCK_TRACK_VIEW_OTHERS_REVIEWS);
    });
  });
  {
  }
});
