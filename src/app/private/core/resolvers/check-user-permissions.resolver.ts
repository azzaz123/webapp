import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckUserPermissionsResolver implements Resolve<boolean> {
  constructor(private userService: UserService) {}

  resolve(): Observable<boolean> {
    return this.userService.checkUserPermissions();
  }
}
