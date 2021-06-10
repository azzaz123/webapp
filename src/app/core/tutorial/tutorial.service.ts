import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { User } from '../user/user';

@Injectable()
export class TutorialService {
  private _step = 0;
  public maxSteps;
  localStorageName = '-tutorial';

  constructor(private userService: UserService) {
    userService.isProfessional().subscribe((isPro: boolean) => {
      this.maxSteps = isPro ? 6 : 7;
    });
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

  public isAlreadyDisplayed(): boolean {
    const user = this.userService.user;

    return user.type === 'professional' ? true : !!localStorage.getItem(user.id + this.localStorageName);
  }
}
