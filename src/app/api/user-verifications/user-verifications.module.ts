import { NgModule } from '@angular/core';
import { UserVerificationsHttpService } from './http/user-verifications-http.service';
import { UserVerificationsService } from './user-verifications.service';

@NgModule({
  providers: [UserVerificationsService, UserVerificationsHttpService],
})
export class UserVerificationsModule {}
