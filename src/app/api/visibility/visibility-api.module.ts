import { NgModule } from '@angular/core';
import { VisibilityApiService } from './visibility-api.service';
import { BumpsHttpService } from './http/bumps.service';

@NgModule({
  providers: [VisibilityApiService, BumpsHttpService],
})
export class VisibilityApiModule {}
