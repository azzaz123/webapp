import { Injectable } from '@angular/core';
import { User } from 'shield';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';

@Injectable()
export class BumpTutorialService {

  private _step = 0;
  public maxSteps = 2;
  localStorageName = '-bump';

  constructor(private userService: UserService) {
  }

  get step(): number {
    return this._step;
  }

  public nextStep() {
    if (this._step < this.maxSteps - 1) {
      this._step++;
    }
  }

  public prevStep() {
    if (this._step > 0) {
      this._step--;
    }
  }

  public resetStep() {
    this._step = 0;
  }

  public setDisplayed() {
    if (this.userService.user) {
      localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
    }
  }

  public isAlreadyDisplayed(): Observable<boolean> {
    return this.userService.me()
      .map((user: User) => !!localStorage.getItem(user.id + this.localStorageName));
  }

}
