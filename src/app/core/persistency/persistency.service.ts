import * as PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Message, statusOrder } from '../message/message';
import {
  StoredConversation,
  StoredMessage,
  StoredMessageRow,
  StoredMetaInfo
} from '../message/messages.interface';
import 'rxjs/add/observable/fromPromise';
import Database = PouchDB.Database;
import AllDocsResponse = PouchDB.Core.AllDocsResponse;
import Document = PouchDB.Core.Document;
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { EventService } from '../event/event.service';

@Injectable()
export class PersistencyService {
  private _messagesDb: Database<StoredMessage>;
  private _conversationsDb: Database<StoredConversation>;
  private storedMessages: AllDocsResponse<StoredMessage>;
  private latestVersion = 2;

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {
    this.eventService.subscribe(EventService.USER_LOGIN, () => {
      this.userService.me().subscribe((user: User) => {
        this._messagesDb = new PouchDB('messages-' + user.id, { auto_compaction: true });
        this.localDbVersionUpdate(this.messagesDb, this.latestVersion, () => {
          this.destroyDbs(() => {
            this._messagesDb = new PouchDB('messages-' + user.id, { auto_compaction: true });
            this.saveDbVersion(this.messagesDb, this.latestVersion);
            this.eventService.emit(EventService.DB_READY);
          }, this.messagesDb);
          this.destroyDbs(() => {}, 'messages', 'conversations', 'conversations-' + user.id);
        });
      });
    });
  }

  set messagesDb(value: PouchDB.Database<any>) {
    this._messagesDb = value;
  }

  set conversationsDb(value: PouchDB.Database<any>) {
    this._conversationsDb = value;
  }

  get messagesDb(): PouchDB.Database<any> {
    return this._messagesDb;
  }

  get conversationsDb(): PouchDB.Database<any> {
    return this._conversationsDb;
  }

  private destroyDbs(callback: Function, ...dbs: Array<Database>) {
    dbs.forEach((db) => {
      new PouchDB(db).destroy().then(() => {
        callback();
      }).catch((err) => {});
    });
  }

  public getMessages(conversationId: string): Observable<StoredMessageRow[]> {
    return Observable.create((observer: Observer<StoredMessageRow[]>) => {
      this.getMessageFromLocal().then((data: AllDocsResponse<StoredMessage>) => {
        const rows: StoredMessageRow[] = _.sortBy(_.filter(data.rows, (row: StoredMessageRow) => {
          return row.doc.conversationId === conversationId;
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
      from: message.from.indexOf('@') > -1 ? message.from.split('@')[0] : message.from,
      conversationId: message.conversationId,
      payload: message.payload
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

  public saveMetaInformation(meta: StoredMetaInfo): Observable<any> {
    const newMoment = (meta.start.indexOf('.') === 10 || meta.start === '0')
      ? moment.unix(Number(meta.start)) // handle cases: '0' (from firstArchive) OR nanotimestamp (from server response)
      : moment(meta.start);             // handle ISO format (from localDb meta doc)
    return Observable.fromPromise(
      this.upsert(this.messagesDb, 'meta', (doc: Document<any>) => {
      if (!doc.start || newMoment.isAfter(moment(doc.start))) {
        doc.start = newMoment.toISOString();
      }
      return doc;
    }));
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

  public getMetaInformation(): Observable<StoredMetaInfo> {
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
      return Promise.reject(new Error('doc id is required'));
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
