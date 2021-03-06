import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable()
export class BlockUserService {
  public static readonly BLOCK_USER_ENDPOINT = `api/v3/instant-messaging/privacy/user`;

  constructor(private httpClient: HttpClient) {}

  public blockUser(userHash: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}${BlockUserService.BLOCK_USER_ENDPOINT}`, { block_user_hashes: [userHash] });
  }

  public unblockUser(userHash: string): Observable<any> {
    return this.httpClient.request('delete', `${environment.baseUrl}${BlockUserService.BLOCK_USER_ENDPOINT}`, {
      body: { unblock_user_hashes: [userHash] },
    });
  }
}
