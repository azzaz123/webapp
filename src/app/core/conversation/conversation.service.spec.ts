import { TestBed, inject } from '@angular/core/testing';

import { TEST_HTTP_PROVIDERS, UserService, EventService, ConversationService, I18nService, ItemService, TrackingService} from 'shield';
import { HaversineService } from 'ng2-haversine';


xdescribe('ConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        UserService,
        I18nService,
        HaversineService,
        TrackingService,
        ItemService,
      ]
    });
  });

  it('should be created', inject([ ConversationService ], (service: ConversationService) => {
    expect(service).toBeTruthy();
  }));
});
