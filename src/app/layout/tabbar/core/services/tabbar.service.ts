import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabbarService {
  public tabBarHidden$: Subject<boolean> = new Subject();

  constructor() {}

  public hideTabBar() {
    this.tabBarHidden$.next(true);
  }

  public showTabBar() {
    this.tabBarHidden$.next(false);
  }
}
