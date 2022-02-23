import { TestBed } from '@angular/core/testing';
import { NotificationApiService } from './notification-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { notificationsDto } from '@api/fixtures/notification/notification-response.fixture';

describe('NotificationApiService', () => {
  let service: NotificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationApiService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should get notifications', () => {
    it('when calls getNotifications', () => {
      spyOn(service, 'getNotifications').and.returnValue(of(notificationsDto));
    });
  });
});
