import { NgModule } from '@angular/core';
import { IsCurrentUserPipe } from './is-current-user/is-current-user.pipe';

@NgModule({
  declarations: [IsCurrentUserPipe],
  exports: [IsCurrentUserPipe],
})
export class PublicPipesModule {}
