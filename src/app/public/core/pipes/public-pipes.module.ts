import { NgModule } from '@angular/core';
import { isCurrentUserPipe } from './is-current-user/is-current-user.pipe';

@NgModule({
  declarations: [isCurrentUserPipe],
  exports: [isCurrentUserPipe],
})
export class PublicPipesModule {}
