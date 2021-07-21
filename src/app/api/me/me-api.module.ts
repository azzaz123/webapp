import { NgModule } from '@angular/core';
import { MeApiService } from '@api/me/me-api.service';
import { FavouritesHttpService } from '@api/me/http/favourites-http.service';

@NgModule({
  providers: [MeApiService, FavouritesHttpService],
})
export class MeApiModule {}
