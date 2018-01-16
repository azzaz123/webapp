import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}
