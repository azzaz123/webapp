import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { BlockUserXmppService } from './block-user-xmpp.service';
import { XmppService } from '../../xmpp/xmpp.service';
import { EventService } from '../../event/event.service';
import { MockedPersistencyService } from '../../../../tests/persistency.fixtures.spec';
import { PersistencyService } from '../../persistency/persistency.service';
import { TrackingService } from '../../tracking/tracking.service';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';
import { Observable } from 'rxjs';

let service: BlockUserXmppService;
let xmppService: XmppService;

describe('BlockUserXmppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockUserXmppService,
        XmppService,
        EventService,
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useValue: {}}
      ]
    });
    service = TestBed.get(BlockUserXmppService);
    xmppService = TestBed.get(XmppService);
  });


  describe('blockUser', () => {
    it('should call xmpp.blockUser when called', () => {
      spyOn(xmppService, 'blockUser').and.returnValue(Observable.of(true));

      service.blockUser(MOCK_USER).subscribe();

      expect(xmppService.blockUser).toHaveBeenCalledWith(MOCK_USER);
    });
  });

  describe('unblockUser', () => {
    it('should call xmpp.unblockUser when called', () => {
      spyOn(xmppService, 'unblockUser').and.returnValue(Observable.of(true));

      service.unblockUser(MOCK_USER).subscribe();

      expect(xmppService.unblockUser).toHaveBeenCalledWith(MOCK_USER);
    });
  });

  describe('getBlockedUsers', () => {
    it('should return the list of blockedUsers', () => {
      xmppService['blockedUsers'] = ['1', '2', '3'];

      const blockedUsers = service.getBlockedUsers();

      expect(blockedUsers).toEqual(xmppService['blockedUsers']);
    });
  });
});
