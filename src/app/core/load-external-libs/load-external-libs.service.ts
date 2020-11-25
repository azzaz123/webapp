import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadExternalLibsService {
  private externalLibsMap: Map<string, Subject<void>> = new Map<
    string,
    Subject<void>
  >();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadScript(src: string | string[]): Observable<void> {
    return Array.isArray(src)
      ? this.buildArrayLoaderObservable(src)
      : this.getSubjectBySrc(src);
  }

  private buildArrayLoaderObservable(sources: string[]): Observable<void> {
    const observables: Observable<void>[] = sources.map((source: string) =>
      this.getSubjectBySrc(source)
    );
    return forkJoin(observables).pipe(map(() => null));
  }

  private getSubjectBySrc(src: string): Observable<void> {
    if (!this.externalLibsMap.has(src)) {
      const subject: Subject<void> = this.buildSubject(src);
      this.externalLibsMap.set(src, subject);
    }

    return this.externalLibsMap.get(src).asObservable();
  }

  private buildSubject(source: string): Subject<void> {
    const subject: Subject<void> = new Subject<void>();
    const script: HTMLScriptElement = this.renderScript(source);
    script.onload = () => {
      subject.next();
    };
    return subject;
  }

  private renderScript(source: string): HTMLScriptElement {
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = source;
    script.async = true;
    script.defer = true;
    this.document.body.appendChild(script);
    return script;
  }
  /*
  private buildObservableLib(source: string): Observable<void> {
    return new Observable((subscriber: Subscriber<void>) => {
      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.src = source;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        subscriber.next();
        subscriber.complete();
      };
      this.document.body.appendChild(script);
    });
  }*/
}
