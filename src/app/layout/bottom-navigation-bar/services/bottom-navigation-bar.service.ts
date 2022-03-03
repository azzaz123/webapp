import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BottomNavigationBarService {
  private readonly hiddenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get hidden$() {
    return this.hiddenSubject.asObservable();
  }

  private set hidden(value: boolean) {
    this.hiddenSubject.next(value);
  }

  public hideNavigationBar() {
    this.hidden = true;
  }

  public showNavigationBar() {
    this.hidden = false;
  }
}
