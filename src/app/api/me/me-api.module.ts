import { NgModule } from '@angular/core';
import { MeApiService } from '@api/me/me-api.service';
import { MeHttpService } from '@api/me/http/me-http.service';

@NgModule({
  providers: [MeApiService, MeHttpService],
})
export class MeApiModule {}
