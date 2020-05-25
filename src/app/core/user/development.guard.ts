import { Injectable, isDevMode } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentGuard implements CanLoad {
  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return isDevMode();
  }
}
