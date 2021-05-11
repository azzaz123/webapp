import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../core/services/search.service';

@Injectable()
export class CanDeactivateSearchGuard implements CanDeactivate<unknown> {
  constructor(private searchService: SearchService) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.searchService.listenToQueryParamsChangesSubject$.next(true);
    return true;
  }
}
