import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PublicFooterService {
  private static INITIAL_STATE = true;

  private showFooterSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(PublicFooterService.INITIAL_STATE);

  get showFooter$(): Observable<boolean> {
    return this.showFooterSubject.asObservable();
  }

  setShow(show: boolean): void {
    this.showFooterSubject.next(show);
  }
}
