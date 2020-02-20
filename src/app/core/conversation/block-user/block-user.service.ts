import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {

  constructor(private httpClient: HttpClient) {
  }

  public blockUser(userHash: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}api/v3/instant-messaging/privacy/user`, { 'block_user_hashes': [userHash] });
  }

  public unblockUser(userHash: string): Observable<any> {
    return this.httpClient
    .request('delete', `${environment.baseUrl}api/v3/instant-messaging/privacy/user`, { body: { 'unblock_user_hashes': [userHash] } });
  }
}
