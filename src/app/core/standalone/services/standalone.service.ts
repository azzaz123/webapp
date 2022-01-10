import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { STANDALONE_STATUS } from '@core/standalone/enums/standalone-status.enum';
import { USER_AGENT } from '@core/user-agent/user-agent';

export const STANDALONE_QUERY_PARAM: string = 'standalone';
const HUAWEI: string = 'huawei';

@Injectable({
  providedIn: 'root',
})
export class StandaloneService {
  private readonly _standalone$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.standaloneStatus);

  constructor(private route: ActivatedRoute, @Inject(USER_AGENT) private userAgent: string) {}

  public get standalone$(): Observable<boolean> {
    return this._standalone$.asObservable();
  }

  private get standaloneStatus(): boolean {
    const isStandalone: boolean = this.route.snapshot.queryParamMap.get(STANDALONE_QUERY_PARAM) === STANDALONE_STATUS.ENABLED;
    const isHuaweiUserAgent: boolean = window.navigator.userAgent.indexOf('hap') >= 0;

    return isStandalone || isHuaweiUserAgent;
  }
}
