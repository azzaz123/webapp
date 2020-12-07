import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabbarComponent } from './tabbar.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { User } from '../../core/user/user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockMessageService } from '../../../tests/message.fixtures.spec';
import { MessageService } from '@features/chat/core/message/message.service';

describe('TabbarComponent', () => {
  let component: TabbarComponent;
  let fixture: ComponentFixture<TabbarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TabbarComponent],
        imports: [NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: UserService,
            useValue: {
              me(): Observable<User> {
                return of(MOCK_USER);
              },
            },
          },
          { provide: MessageService, useClass: MockMessageService },
          { provide: 'SUBDOMAIN', useValue: 'es' },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when using a text input: on focus in', () => {
    it('should hide the tab bar', () => {
      component.onFocusIn('INPUT');

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a text input: on focus out', () => {
    it('should show the tab bar', () => {
      component.onFocusOut('INPUT');

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a textarea: on focus in', () => {
    it('should hide the tab bar', () => {
      component.onFocusIn('TEXTAREA');

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a textarea: on focus out', () => {
    it('should show the tab bar', () => {
      component.onFocusOut('TEXTAREA');

      expect(component.hidden).toBe(false);
    });
  });
});
