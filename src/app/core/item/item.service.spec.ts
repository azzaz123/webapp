import { TestBed, inject } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, I18nService, TrackingService, EventService, UserService } from 'shield';

import { ItemService } from './item.service';

describe('ItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemService,
        ...TEST_HTTP_PROVIDERS,
        {provide: I18nService, useValue: {}},
        {provide: TrackingService, useValue: {}},
        {provide: EventService, useValue: {}},
        {provide: UserService, useValue: {}},
      ]
    });
  });

  it('should be created', inject([ItemService], (service: ItemService) => {
    expect(service).toBeTruthy();
  }));
});
