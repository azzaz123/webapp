import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { User } from '../user/user';
import { Observable } from 'rxjs';
import { InboxUser } from '../../chat/chat-with-inbox/inbox/inbox-user';

@Injectable()
export class BlockUserService {

  constructor(private xmpp: XmppService) { }

  public blockUser(user: User | InboxUser): Observable<any> { // TODO: This maybe will be moved to an EndPoint and not using XMPP
    return this.xmpp.blockUser(user);
  }

  public unblockUser(user: User | InboxUser): Observable<any> { // TODO: This maybe will be moved to an EndPoint and not using XMPP
    return this.xmpp.unblockUser(user);
  }

  public getBlockedUsers(): Array<string> {
    return this.xmpp.blockedUsers;
  }
}
