import { TestBed } from '@angular/core/testing';
import { NotificationApiService } from './notification-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExternalCommsService } from '@core/external-comms.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@core/user/user.service';

describe('NotificationApiService', () => {
  let service: NotificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationApiService,
        {
          provide: ExternalCommsService,
          useValue: {
            brazeReady$: new BehaviorSubject(true),
          },
        },
        {
          provide: UserService,
          useValue: {
            isLogged: true,
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: This could be decently mocked
  beforeEach(() => {
    spyOn(appboy, 'subscribeToContentCardsUpdates');
    spyOn(appboy, 'requestContentCardsRefresh');
    spyOn(appboy, 'getCachedContentCards');
    spyOn(appboy, 'logContentCardsDisplayed');
    spyOn(appboy, 'logCardImpressions');
    spyOn(appboy, 'logCardClick');
    spyOn(appboy, 'requestImmediateDataFlush');
  });

  describe('When asked to refresh notifications', () => {
    it('should ask appboy to refresh content cards', () => {
      service.refreshNotifications();
      expect(appboy.requestContentCardsRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
