import { TestBed, inject } from '@angular/core/testing';

import { BlockUserService } from './block-user.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { PersistencyService } from '../persistency/persistency.service';
import { TrackingService } from '../tracking/tracking.service';

describe('BlockUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockUserService,
        XmppService,
        EventService,
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useValue: {}}
      ]
    });
  });

  it('should be created', inject([BlockUserService], (service: BlockUserService) => {
    expect(service).toBeTruthy();
  }));
});
