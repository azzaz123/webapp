import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { WindowRef } from '../window/window.service';
import { User } from './user';

@Injectable()
export class ProfessionalGuard implements CanActivate {

  constructor(private userService: UserService,
    private window: WindowRef) {
  }

  public canActivate() {
    return this.userService.me().map((user: User) => {
      return user.type === 'professional' ? true : false;
    });
  }
}

