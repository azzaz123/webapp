import { Injectable, isDevMode } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentGuard implements CanLoad {
  constructor(private router: Router) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    const devEnv = isDevMode();
    if (!devEnv) {
      this.router.navigate(['/chat']);
    }
    return devEnv;
  }
}
