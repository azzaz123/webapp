import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from 'shield';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TutorialService {

  step = 0;
  localStorageName = '-tutorial';

  constructor(private userService: UserService) {
  }

  public setDisplayed() {
    localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
  }

  public isAlreadyDisplayed(): Observable<boolean> {
    return this.userService.me()
      .map((user: User) => !!localStorage.getItem(user.id + this.localStorageName));
  }

}
