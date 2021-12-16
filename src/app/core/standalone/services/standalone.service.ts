import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { STANDALONE_STATUS } from '@core/standalone/enums/standalone-status.enum';

const STANDALONE_QUERY_PARAM: string = 'standalone';

@Injectable({
  providedIn: 'root',
})
export class StandaloneService {
  private readonly _standalone$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.standaloneStatus);

  constructor(private route: ActivatedRoute) {}

  public get standalone$(): Observable<boolean> {
    return this._standalone$.asObservable();
  }

  private get standaloneStatus(): boolean {
    const isStandalone = this.route.snapshot.queryParamMap.get(STANDALONE_QUERY_PARAM) === STANDALONE_STATUS.ENABLED;
    if (isStandalone) return true;
    return false;
  }
}
