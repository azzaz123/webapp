import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { EventService } from '../event/event.service';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import { TrackingEvent } from '../tracking/tracking-event';
import Document = PouchDB.Core.Document;

@Injectable()
export class PersistencyService {
  private clickstreamDb: any;
  private latestVersion = 2.0;
  public clickstreamDbName = 'clickstreamEvents';
  private eventsStore;
  private packagedEventsStore = 'packagedEvents';
  private userId: string;

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {
    this.eventService.subscribe(EventService.USER_LOGIN, () => {
      this.userService.me().subscribe((user: User) => {
        this.userId = user.id;
        this.initClickstreamDb(this.clickstreamDbName);
        this.eventsStore = 'events-' + this.userId;
      });
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

  private getDbVersion(localDb): Observable<any> {
    return Observable.fromPromise(localDb.get('version'));
  }

  private saveDbVersion(localDb, newVersion: number): Observable<any> {
    return Observable.fromPromise(
      this.upsert(localDb, 'version', (doc: Document<any>) => {
        doc.version = newVersion;
        return doc;
      }).catch((err) => {
      }));
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
        return { updated: false, rev: docRev };
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
