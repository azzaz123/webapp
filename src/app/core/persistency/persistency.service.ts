import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Message, statusOrder, phoneRequestState } from '../message/message';
import {
  StoredMessage,
  StoredMessageRow,
  StoredMetaInfo,
  StoredMetaInfoData
} from '../message/messages.interface';
import 'rxjs/add/observable/fromPromise';
import Database = PouchDB.Database;
import AllDocsResponse = PouchDB.Core.AllDocsResponse;
import Document = PouchDB.Core.Document;
import { UserService } from '../user/user.service';
import { User, InboxUser } from '../user/user';
import { EventService } from '../event/event.service';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import { TrackingEvent } from '../tracking/tracking-event';
import { InboxConversation, StoredInboxConversation } from '../conversation/conversation';
import { InboxItem } from '../item/item';

@Injectable()
export class PersistencyService {
  private _messagesDb: Database<StoredMessage>;
  private _conversationsDb: Database<any>;
  private _inboxDb: Database<any>;
  private clickstreamDb: any;
  private storedMessages: AllDocsResponse<StoredMessage>;
  private latestVersion = 2.0;
  public clickstreamDbName = 'clickstreamEvents';
  private eventsStore;
  private packagedEventsStore = 'packagedEvents';

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {
    this.eventService.subscribe(EventService.USER_LOGIN, () => {
      this.userService.me().subscribe((user: User) => {
        this.initClickstreamDb(this.clickstreamDbName);
        this.eventsStore = 'events-' + user.id;
        this._messagesDb = new PouchDB('messages-' + user.id, { auto_compaction: true });
        this.initInboxDb(user.id);
        this.localDbVersionUpdate(this.messagesDb, this.latestVersion, () => {
          this.messagesDb.destroy().then(() => {
            this._messagesDb = new PouchDB('messages-' + user.id, { auto_compaction: true });
            this.saveDbVersion(this.messagesDb, this.latestVersion);
            this.eventService.emit(EventService.DB_READY);
          });
          this.destroyDbs('messages', 'conversations', 'conversations-' + user.id);
        });
      });
    });
    this.subscribeEventNewMessage();
  }

  set messagesDb(value: PouchDB.Database<any>) {
    this._messagesDb = value;
  }

  set inboxDb(value: PouchDB.Database<any>) {
    this._inboxDb = value;
  }

  public initInboxDb(userId: string) {
    this.inboxDb = new PouchDB('inbox-' + userId, { auto_compaction: true });
  }

  public updateStoredInbox(conversations: InboxConversation[]): Observable<any> {
    return Observable.fromPromise(
      this.inboxDb.destroy().then(() => {
        this.inboxDb = new PouchDB('inbox-' + this.userService.user.id, { auto_compaction: true });
        const inboxToSave = conversations.map((conversation: InboxConversation) =>
          new StoredInboxConversation(conversation.id, conversation.modifiedDate, conversation.user, conversation.item,
            conversation.phoneShared, conversation.unreadCounter, conversation.lastMessage));
        return Observable.fromPromise(this.inboxDb.bulkDocs(inboxToSave));
      })
    );
  }

  public getStoredInbox(): Observable<InboxConversation[]> {
    return Observable.fromPromise((this.inboxDb.allDocs({ include_docs: true })).then((data) => {
      return this.mapToInboxConversation(data);
    }));
  }

  private mapToInboxConversation(data): InboxConversation[] {
    return data.rows.map(row => {
      const conv = row.doc;
      const user = new InboxUser(conv.user._id, conv.user._microName, conv.user._blocked, conv.user._available);
      const item = new InboxItem(conv.item._id, conv.item._price, conv.item._title, conv.item._mainImage, conv.item._status);
      const lastMessage = new Message(conv.lastMessage._id, conv.lastMessage._thread, conv.lastMessage._message,
        conv.lastMessage._from, conv.lastMessage._date, conv.lastMessage._status, conv.lastMessage._payload,
        conv.lastMessage._phoneRequest);
      return new InboxConversation(conv._id, conv.modifiedDate, user, item,  conv.phoneShared, conv.unreadCounter, lastMessage);
    });
  }


  private initClickstreamDb(dbName: string, version?: number) {
    const request = version ? window.indexedDB.open(dbName, version) : window.indexedDB.open(dbName);
    request.onsuccess = () => {
      this.clickstreamDb = request.result;
      if (!request.result.objectStoreNames.contains(this.eventsStore)) {
        const v = request.result.version;
        request.result.close();
        this.initClickstreamDb(dbName, v + 1);
      } else {
        this.eventService.emit(EventService.DB_READY, this.clickstreamDb.name);
      }
    };
    request.onupgradeneeded = (e) => {
      request.result.createObjectStore(this.eventsStore, { keyPath: 'id' });
      if (e.newVersion === 1) {
      request.result.createObjectStore(this.packagedEventsStore);
      }
    };
  }

  private removeClickstreamEvents(sentEvents: Array<TrackingEventData>) {
    sentEvents.map(event => {
      this.clickstreamDb.transaction([this.eventsStore], 'readwrite').objectStore(this.eventsStore).delete(event.id);
    });
  }

  public removePackagedClickstreamEvents(eventsPackage: TrackingEvent): Observable<boolean> {
    const storedWithKey = eventsPackage.sessions[0].events[0].id;
    return Observable.create(
      (observer: Observer<boolean>) => {
        this.clickstreamDb.transaction([this.packagedEventsStore], 'readwrite').objectStore(this.packagedEventsStore)
        .delete(storedWithKey).onsuccess = () => {
          observer.next(true);
        };
      });
  }

  public getClickstreamEvents(): Observable<Array<TrackingEventData>> {
    return Observable.create(
    (observer: Observer<Array<TrackingEventData>>) => {
      this.clickstreamDb.transaction([this.eventsStore]).objectStore(this.eventsStore).getAll().onsuccess = (event) => {
        observer.next(event.target.result);
      };
    });
  }

  public getPackagedClickstreamEvents(): Observable<Array<TrackingEvent>> {
    return Observable.create(
    (observer: Observer<Array<TrackingEventData>>) => {
      this.clickstreamDb.transaction([this.packagedEventsStore]).objectStore(this.packagedEventsStore).getAll().onsuccess = (event) => {
        observer.next(event.target.result);
      };
    });
  }

  public storeClickstreamEvent(clickstreamEvent: TrackingEventData | any) {
    this.clickstreamDb.transaction([this.eventsStore], 'readwrite').objectStore(this.eventsStore).add(clickstreamEvent);
  }

  public storePackagedClickstreamEvents(eventsPackage: any) {
    const storedKey = eventsPackage.sessions[0].events[0].id;
    this.clickstreamDb.transaction([this.packagedEventsStore], 'readwrite').objectStore(this.packagedEventsStore)
    .add(eventsPackage, storedKey).onsuccess = () => {
      this.removeClickstreamEvents(eventsPackage.sessions[0].events);
    };
  }

  set conversationsDb(value: PouchDB.Database<any>) {
    this._conversationsDb = value;
  }

  get messagesDb(): PouchDB.Database<any> {
    return this._messagesDb;
  }

  get inboxDb(): PouchDB.Database<any> {
    return this._inboxDb;
  }

  get conversationsDb(): PouchDB.Database<any> {
    return this._conversationsDb;
  }

  private destroyDbs(...dbs: Array<Database>) {
    dbs.forEach((db) => {
      new PouchDB(db).destroy().catch(() => {});
    });
  }

  public getMessages(thread: string): Observable<StoredMessageRow[]> {
    return Observable.create((observer: Observer<StoredMessageRow[]>) => {
      this.getMessageFromLocal().then((data: AllDocsResponse<StoredMessage>) => {
        const rows: StoredMessageRow[] = _.sortBy(_.filter(data.rows, (row: StoredMessageRow) => {
          return row.doc.conversationId === thread;
        }), (row: StoredMessageRow) => {
          return row.doc.date;
        });
        observer.next(rows);
      }, () => {
        observer.next([]);
      });
    });
  }

  public resetCache() {
    this.storedMessages = null;
  }

  private getMessageFromLocal(): Promise<AllDocsResponse<StoredMessage>> {
    if (this.storedMessages && this.storedMessages.total_rows > 0) {
      return Promise.resolve(this.storedMessages);
    }
    return (this.messagesDb.allDocs({include_docs: true}).then((data: AllDocsResponse<StoredMessage>) => {
      this.storedMessages = data;
      return data;
    }));
  }

  private buildResponse(message: Message): StoredMessage {
    return {
      _id: message.id,
      date: message.date,
      message: message.message,
      status: message.status,
      from: message.from,
      conversationId: message.thread,
      payload: message.payload,
      phoneRequest: message.phoneRequest
    };
  }

  public saveMessages(messages: Array<Message> | Message): Observable<any> {
    if (Array.isArray(messages)) {
      const messagesToSave: StoredMessage[] = messages.map((message: Message) => {
        return this.buildResponse(message);
      });
      return Observable.fromPromise(this.messagesDb.bulkDocs(
        messagesToSave
      ));
    } else {
      return Observable.fromPromise(
        this.upsert(this.messagesDb, messages.id, () => {
          return this.buildResponse(messages);
        })
      );
    }
  }

  private subscribeEventNewMessage() {
    this.eventService.subscribe(EventService.CHAT_LAST_RECEIVED_TS, (timestamp: number) => {
      this.saveMetaInformation({
        start: new Date(timestamp).toISOString(),
        last: null
      });
    });
  }

  public saveMetaInformation(data: StoredMetaInfo): Observable<any> {
    const newMoment = (data.start.indexOf('.') === 10 || data.start === '0')
      ? moment.unix(Number(data.start)) // handle cases: '0' (from firstArchive) OR nanotimestamp (from server response)
      : moment(data.start);             // handle ISO format (from localDb meta doc)
    data.start = newMoment.toISOString();
    return Observable.fromPromise(
      this.upsert(this.messagesDb, 'meta', (doc: Document<any>) => {
      if (!doc.data || !doc.data.start || newMoment.isAfter(moment(doc.data.start))) {
        doc.data = data;
      }
      return doc;
    }));
  }

  public setPhoneNumber(phone: string): Observable<any> {
    return Observable.fromPromise(
      this.upsert(this.messagesDb, 'phone', (doc: Document<any>) => {
      if (!doc.phone || doc.phone !== phone) {
        doc.phone = phone;
        return doc;
      }
    }).catch(err => {}));
  }

  public getPhoneNumber(): Observable<any> {
    return Observable.fromPromise(this.messagesDb.get('phone')).catch(() => Observable.of({}));
  }

  public updateMessageDate(message: Message) {
    return Observable.fromPromise(this.upsert(this.messagesDb, message.id, (doc: Document<any>) => {
        doc.date = message.date.toISOString();
        return doc;
      })
    );
  }

  public findMessage(messageId: string): Observable<any> {
    return Observable.fromPromise(this.messagesDb.get(messageId));
  }

  public updateMessageStatus(message: Message, newStatus: string) {
    return Observable.fromPromise(this.upsert(this.messagesDb, message.id, (doc: Document<any>) => {
      if (!doc.status || statusOrder.indexOf(newStatus) > statusOrder.indexOf(doc.status) || doc.status === null) {
        this.saveMessages(message);
      }
    }));
  }

  public markPhoneRequestAnswered(message: Message) {
    return Observable.fromPromise(this.upsert(this.messagesDb, message.id, (doc: Document<any>) => {
      doc.phoneRequest = phoneRequestState.answered;
      return doc;
    }));
  }

  public getMetaInformation(): Observable<StoredMetaInfoData> {
    return Observable.fromPromise(this.messagesDb.get('meta'));
  }

  private getDbVersion(localDb): Observable<any> {
    return Observable.fromPromise(localDb.get('version'));
  }

  private saveDbVersion(localDb, newVersion: number): Observable<any> {
    return Observable.fromPromise(
      this.upsert(localDb, 'version', (doc: Document<any>) => {
        doc.version = newVersion;
        return doc;
      }).catch((err) => {}));
  }

  /* This method is used to update data in the local database when the schema is changed, and we want
     these changes to be applied to existing (already stored) data. */
  public localDbVersionUpdate(localDb, newVersion: number, callback: Function) {
    this.getDbVersion(localDb).subscribe((response) => {
      if (response.version < newVersion) {
        callback();
        this.saveDbVersion(localDb, newVersion);
      } else {
        this.eventService.emit(EventService.DB_READY);
      }
    }, (error) => {
      if (error.reason === 'missing') {
        callback();
        this.saveDbVersion(localDb, newVersion);
      }
    });
  }

  /* istanbul ignore next */

  private upsert(db, docId, diffFun) {
    if (typeof docId !== 'string') {
      return throwError(new Error('doc id is required'));
    }

    return db.get(docId)
    .catch((err) => {
      if (err.status !== 404) {
        throw err;
      }
      return {};
    })
    .then((doc) => {
      const docRev = doc._rev;
      const newDoc = diffFun(doc);
      if (!newDoc) {
        return {updated: false, rev: docRev};
      }

      newDoc._id = docId;
      newDoc._rev = docRev;
      return this.tryAndPut(db, newDoc, diffFun);
    });
  }

  /* istanbul ignore next */


  private tryAndPut(db, doc, diffFun) {
    return db.put(doc).then((res) => {
      return {
        updated: true,
        rev: res.rev
      };
    }, (err) => {
      if (err.status !== 409) {
        throw err;
      }
      return this.upsert(db, doc._id, diffFun);
    });
  }
}
