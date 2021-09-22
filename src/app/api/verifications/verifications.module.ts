import { NgModule } from '@angular/core';
import { VerificationsHttpService } from './http/verifications-http.service';
import { VerificationsService } from './verifications.service';

@NgModule({
  providers: [VerificationsService, VerificationsHttpService],
})
export class VerificationsModule {}
