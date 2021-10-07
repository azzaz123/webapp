import { Injectable } from '@angular/core';
import { UserVerifications } from '@api/core/model/verifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';
import { mapUserVerificationsApiToUserVerifications } from './mappers/user-verifications.mapper';

@Injectable()
export class UserVerificationsService {
  constructor(private userVerificationsHttpService: UserVerificationsHttpService) {}

  public get userVerifications$(): Observable<UserVerifications> {
    return this.userVerificationsHttpService.get().pipe(map(mapUserVerificationsApiToUserVerifications));
  }
}
