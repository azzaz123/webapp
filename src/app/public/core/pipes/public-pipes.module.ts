import { NgModule } from '@angular/core';
import { IsLoggedUserPipe } from './is-loged-user/is-logged-user.pipe';

@NgModule({
  declarations: [IsLoggedUserPipe],
  exports: [IsLoggedUserPipe],
})
export class PublicPipesModule {}
