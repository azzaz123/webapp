import { Injectable } from '@angular/core';
import { XmppService } from '../../core/xmpp/xmpp.service';
import { User } from '../../core/user/user';
import { Observable } from 'rxjs';
import { InboxUser } from '../model/inbox-user';

@Injectable()
export class BlockUserXmppService {
  constructor(private xmpp: XmppService) {}

  public blockUser(user: User | InboxUser): Observable<any> {
    // TODO: This maybe will be moved to an EndPoint and not using XMPP
    return this.xmpp.blockUser(user);
  }

  public unblockUser(user: User | InboxUser): Observable<any> {
    // TODO: This maybe will be moved to an EndPoint and not using XMPP
    return this.xmpp.unblockUser(user);
  }

  public getBlockedUsers(): Array<string> {
    return this.xmpp.blockedUsers;
  }
}
