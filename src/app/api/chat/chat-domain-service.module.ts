import { NgModule } from '@angular/core';
import { ChatDomainService } from '@api/chat/chat-domain.service';
import { ChatHttpService } from '@api/chat/http/chat-http.service';

@NgModule({
  providers: [ChatDomainService, ChatHttpService],
})
export class ChatDomainServiceModule {}
