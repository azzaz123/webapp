import { TestBed, inject } from '@angular/core/testing';
import { RealTimeService } from './real-time.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useValue: {}}
      ]
    });
  });

  it('should be created', inject([RealTimeService], (service: RealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
