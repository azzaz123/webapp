import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnreadMessagesCounterDto } from '@api/bff/instant-messaging/dtos/messages-unread-dto.interface';
import { environment } from '@environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export const INSTANT_MESSAGES_API = 'api/v3/instant-messaging';
export const UNREAD_MESSAGES_COUNT_ENDPOINT = `${INSTANT_MESSAGES_API}/messages/unread`;

@Injectable({
  providedIn: 'root',
})
export class UnreadChatMessagesService {
  public totalUnreadMessages$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private titleService: Title, private http: HttpClient) {
    this.totalUnreadMessages$.subscribe((unreadMessages: number) => {
      let title: string = this.titleService.getTitle().split(') ')[1];
      title = title ? title : this.titleService.getTitle();
      if (unreadMessages > 0) {
        title = '(' + unreadMessages + ') ' + title;
      }
      this.titleService.setTitle(title);
    });
  }

  public initializeUnreadChatMessages(): Promise<UnreadMessagesCounterDto> {
    return this.http
      .get<UnreadMessagesCounterDto>(`${environment.baseUrl}${UNREAD_MESSAGES_COUNT_ENDPOINT}`)
      .pipe(
        tap((count) => {
          this.totalUnreadMessages = count.unread_counter;
        })
      )
      .toPromise();
  }

  set totalUnreadMessages(value: number) {
    value = Math.max(value, 0);
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this.totalUnreadMessages$.getValue();
  }
}
