import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from 'shield';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TutorialService {

  private _step = 0;
  localStorageName = '-tutorial';

  constructor(private userService: UserService) {
  }

  get step(): number {
    return this._step;
  }

  public nextStep() {
    this._step++;
  }

  public resetStep() {
    this._step = 0;
  }

  public setDisplayed() {
    localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
  }

  public isAlreadyDisplayed(): Observable<boolean> {
    return this.userService.me()
      .map((user: User) => !!localStorage.getItem(user.id + this.localStorageName));
  }

}
