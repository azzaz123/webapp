import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadExternalLibsService {
  private externalLibsMap: Map<string, ReplaySubject<void>> = new Map<
    string,
    ReplaySubject<void>
  >();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public loadScript(src: string | string[]): Observable<void> {
    const observable: Observable<any> = Array.isArray(src)
      ? this.buildArrayLoaderObservable(src)
      : this.getSubjectBySrc(src);
    return observable;
  }

  private buildArrayLoaderObservable(sources: string[]): Observable<void> {
    const observables: Observable<void>[] = sources.map((source: string) =>
      this.getSubjectBySrc(source)
    );
    return forkJoin(observables).pipe(map(() => null));
  }

  private getSubjectBySrc(src: string): Observable<void> {
    if (!this.externalLibsMap.has(src)) {
      const subject: ReplaySubject<void> = this.buildSubject(src);
      this.externalLibsMap.set(src, subject);
    }

    return this.externalLibsMap.get(src).asObservable();
  }

  private buildSubject(source: string): ReplaySubject<void> {
    const subject: ReplaySubject<void> = new ReplaySubject<void>();
    const script: HTMLScriptElement = this.renderScript(source);
    script.onload = () => {
      subject.next();
      subject.complete();
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
}
