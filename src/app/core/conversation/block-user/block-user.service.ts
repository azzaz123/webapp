import { Injectable } from '@angular/core';

import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {

  constructor(private http: HttpService) {
  }

  public blockUser(userHash: string): Observable<any> {
    return this.http.put('api/v3/instant-messaging/privacy/user', { 'block_user_hashes': [userHash] });
  }

  public unblockUser(userHash: string): Observable<any> {
    return this.http.delete('api/v3/instant-messaging/privacy/user', { body: { 'unblock_user_hashes': [userHash] } });
  }
}
