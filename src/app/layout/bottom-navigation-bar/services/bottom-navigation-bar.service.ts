import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BottomNavigationBarService {
  public hidden$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public hideNavigationBar() {
    this.hidden$.next(true);
  }

  public showNavigationBar() {
    this.hidden$.next(false);
  }
}
