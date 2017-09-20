import { Injectable } from '@angular/core';
import { EventService as EventServiceMaster } from 'shield';

@Injectable()
export class EventService extends EventServiceMaster {

  public static FIND_CONVERSATION = 'findConversation';
  public static UPDATE_COORDINATE = 'updateCoordinate';
  public static UPDATE_CATEGORY = 'updateCategory';
  public static UPDATE_SEARCH = 'updateSearch';
}
