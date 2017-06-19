import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Http, RequestOptions, Headers } from "@angular/http";

@Injectable()
export class LoginService {

  private _token: string;

  constructor(private http: Http) {
  }

  public checkToken(): Observable<any> {
    let headers = new Headers({'x-auth-token': this.token});
    let options = new RequestOptions({headers: headers});
    return this.http.get('/internal/token/checkToken', options);
  }

  public logout(): void {
    this.token = undefined;
    localStorage.removeItem('token');
  }
  
  get token(): string {
    if (!this._token) {
      let accessToken: string = localStorage.getItem('token');
      if (accessToken) {
        this._token = accessToken;
      }
    }
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
}
