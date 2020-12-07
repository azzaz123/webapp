import { TestBed } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { RemoteConsoleService } from '@core/remote-console';
import { TrackingService } from '@core/tracking/tracking.service';
import { XmppService } from '@core/xmpp/xmpp.service';
import { MockRemoteConsoleService } from '@fixtures/remote-console.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';
import { BlockUserXmppService } from './block-user-xmpp.service';

let service: BlockUserXmppService;
let xmppService: XmppService;

describe('BlockUserXmppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockUserXmppService,
        XmppService,
        EventService,
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: TrackingService, useValue: {} },
      ],
    });
    service = TestBed.inject(BlockUserXmppService);
    xmppService = TestBed.inject(XmppService);
  });

  describe('blockUser', () => {
    it('should call xmpp.blockUser when called', () => {
      spyOn(xmppService, 'blockUser').and.returnValue(of(true));

      service.blockUser(MOCK_USER).subscribe();

      expect(xmppService.blockUser).toHaveBeenCalledWith(MOCK_USER);
    });
  });

  describe('unblockUser', () => {
    it('should call xmpp.unblockUser when called', () => {
      spyOn(xmppService, 'unblockUser').and.returnValue(of(true));

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
