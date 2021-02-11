import { NgModule } from '@angular/core';
import { IsCurrentUserPipe } from './is-current-user/is-current-user.pipe';
import { UrlProtocolPipe } from './url-protocol/url-protocol.pipe';

@NgModule({
  declarations: [IsCurrentUserPipe, UrlProtocolPipe],
  exports: [IsCurrentUserPipe, UrlProtocolPipe],
})
export class PublicPipesModule {}
