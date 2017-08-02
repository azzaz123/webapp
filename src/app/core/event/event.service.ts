import { Injectable } from '@angular/core';
import { EventService as EventServiceMaster } from 'shield';

@Injectable()
export class EventService extends EventServiceMaster {

  public static FIND_CONVERSATION = 'findConversation';

}
