import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}
