import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { User } from '../user/user';
import { Observable } from 'rxjs';

@Injectable()
export class BlockUserService {

  constructor(private xmpp: XmppService) { }

  public blockUser(user: User): Observable<any> {
    return this.xmpp.blockUser(user);
  }

  public unblockUser(user: User): Observable<any> {
    return this.xmpp.unblockUser(user);
  }

  public isBlocked(userId: string): boolean {
    return this.xmpp.isBlocked(userId);
  }

}
