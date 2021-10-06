import { NgModule } from '@angular/core';
import { ChatApiService } from '@api/chat/chat-api.service';
import { ChatHttpService } from '@api/chat/http/chat-http.service';

@NgModule({
  providers: [ChatApiService, ChatHttpService],
})
export class ChatApiModule {}
