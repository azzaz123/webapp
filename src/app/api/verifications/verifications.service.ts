import { Injectable } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerificationsHttpService } from './http/verifications-http.service';
import { mapVerificationsApiToVerifications } from './mappers/verifications.mapper';

@Injectable()
export class VerificationsService {
  constructor(private verificationsHttpService: VerificationsHttpService) {}

  public get verifications$(): Observable<UserVerifications> {
    return this.verificationsHttpService.get().pipe(map(mapVerificationsApiToVerifications));
  }
}
