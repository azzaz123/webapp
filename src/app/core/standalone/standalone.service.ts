import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QParam } from '@core/constants/queryParams.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { Status } from '@core/constants/status.enum';

@Injectable({
  providedIn: 'root',
})
export class StandaloneService {
  private readonly _standalone$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkStandaloneQParam());

  constructor(private route: ActivatedRoute) {}

  public get standalone$(): Observable<boolean> {
    return this._standalone$.asObservable();
  }

  private checkStandaloneQParam(): boolean {
    const isStandalone = this.route.snapshot.queryParamMap.get(QParam.Standalone) === Status.True;
    if (isStandalone) return true;
    return false;
  }
}
