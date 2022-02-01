import { of } from 'rxjs';

export class MockUploaderService {
  serviceEvents$ = of(null);

  uploadFile() {
    return of(null);
  }
}
