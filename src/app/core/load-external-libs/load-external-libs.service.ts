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

  public loadScriptBySource(src: string | string[]): Observable<void> {
    const observable: Observable<any> = Array.isArray(src)
      ? this.buildArrayLoaderObservable(src)
      : this.getSubjectBySrc(src);
    return observable;
  }

  public loadScriptByText(name: string, text: string): Observable<void> {
    if (!this.externalLibsMap.has(name)) {
      const script: HTMLScriptElement = this.renderText(text);
      const subject: ReplaySubject<void> = this.buildSubject(script);
      this.externalLibsMap.set(name, subject);
    }
    return this.externalLibsMap.get(name).asObservable();
  }

  private buildArrayLoaderObservable(sources: string[]): Observable<void> {
    const observables: Observable<void>[] = sources.map((source: string) =>
      this.getSubjectBySrc(source)
    );
    return forkJoin(observables).pipe(map(() => null));
  }

  private getSubjectBySrc(src: string): Observable<void> {
    if (!this.externalLibsMap.has(src)) {
      const script: HTMLScriptElement = this.renderSource(src);
      const subject: ReplaySubject<void> = this.buildSubject(script);
      this.externalLibsMap.set(src, subject);
    }

    return this.externalLibsMap.get(src).asObservable();
  }

  private buildSubject(script: HTMLScriptElement): ReplaySubject<void> {
    const subject: ReplaySubject<void> = new ReplaySubject<void>();
    script.onload = () => {
      subject.next();
      subject.complete();
    };
    return subject;
  }

  private renderSource(source: string): HTMLScriptElement {
    const script: HTMLScriptElement = this.renderScript();
    script.src = source;
    return script;
  }

  private renderText(text: string): HTMLScriptElement {
    const script: HTMLScriptElement = this.renderScript();
    script.text = text;
    return script;
  }

  private renderScript(): HTMLScriptElement {
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    this.document.body.appendChild(script);
    return script;
  }
}
