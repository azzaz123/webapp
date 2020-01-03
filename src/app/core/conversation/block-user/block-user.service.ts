import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {

  constructor(private http: HttpClient) {
  }

  public blockUser(userHash: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}api/v3/instant-messaging/privacy/user` , { 'block_user_hashes': [userHash] });
  }

  public unblockUser(userHash: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { 'unblock_user_hashes': [userHash] }
    };
    return this.http.delete(`${environment.baseUrl}api/v3/instant-messaging/privacy/user`, options);
  }
}
