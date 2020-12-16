import { of } from 'rxjs';

export class MockUploaderService {
  uploadFile() {
    return of(null);
  }
  serviceEvents$ = of(null);
}
