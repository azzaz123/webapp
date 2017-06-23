import { User, Item, Message } from 'shield';
import { Lead } from './lead';

export class Conversation extends Lead {

  constructor(id: string,
              legacyId: number,
              modifiedDate: number,
              private _expectedVisit: boolean = false,
              user?: User,
              item?: Item,
              messages: Array<Message> = [],
              phone?: string) {
    super(id, legacyId, modifiedDate, user, item, messages, phone);
  }

  get expectedVisit(): boolean {
    return this._expectedVisit;
  }
}
