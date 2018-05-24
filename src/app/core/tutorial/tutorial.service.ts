import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user';

@Injectable()
export class TutorialService {

  private _step = 0;
  public maxSteps = 6;
  localStorageName = '-tutorial';

  constructor(private userService: UserService) {
  }

  get step(): number {
    return this._step;
  }

  public nextStep(): void {
    if (this._step < this.maxSteps - 1) {
      this._step++;
    }
  }

  public prevStep(): void {
    if (this._step > 0) {
      this._step--;
    }
  }

  public resetStep(): void {
    this._step = 0;
  }

  public setDisplayed(): void {
    if (this.userService.user) {
      localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
    }
  }

  public isAlreadyDisplayed(): Observable<boolean> {
    return this.userService.me()
      .map((user: User) => user.type === 'professional' ? true : !!localStorage.getItem(user.id + this.localStorageName));
  }
}
