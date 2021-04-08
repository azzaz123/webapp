import { of } from 'rxjs';

export class IsCurrentUserPipeMock {
  transform() {
    return of(false);
  }
}
