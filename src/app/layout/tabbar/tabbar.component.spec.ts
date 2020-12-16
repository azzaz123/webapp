import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { MessageService } from '@features/chat/core/message/message.service';
import { MockMessageService } from '@fixtures/message.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { TabbarComponent } from './tabbar.component';

describe('TabbarComponent', () => {
  let component: TabbarComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TabbarComponent>;
  let eventService: EventService;

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
              get isLogged(): boolean {
                return true;
              },
            },
          },
          { provide: MessageService, useClass: MockMessageService },
          { provide: 'SUBDOMAIN', useValue: 'es' },
          EventService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
    eventService = TestBed.inject(EventService);
  });

  describe('ngOnInit', () => {
    it('should set user session', () => {
      component.isLogged = null;

      component.ngOnInit();

      expect(component.isLogged).toBe(true);
    });

    it('should update user session on user login', () => {
      component.isLogged = null;

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGIN);

      expect(component.isLogged).toBe(true);
    });

    it('should update user session on user logout', () => {
      component.isLogged = null;

      component.ngOnInit();
      eventService.emit(EventService.USER_LOGOUT);

      expect(component.isLogged).toBe(true);
    });
  });

  describe('when user session changes', () => {
    const accessBtnTextSelector = '#tab-bar-access-zone span';

    describe('when user is logged', () => {
      beforeEach(() => {
        component.hidden = false;
        component.isLogged = true;

        fixture.detectChanges();
      });

      it('should show logged content', () => {
        expect(el.querySelector(accessBtnTextSelector).innerHTML).toEqual(
          'My Zone'
        );
      });
    });

    describe('when user is not logged', () => {
      beforeEach(() => {
        component.isLogged = false;
        fixture.detectChanges();
      });

      it('should show no logged content', () => {
        expect(el.querySelector(accessBtnTextSelector).innerHTML).toEqual(
          'Log in'
        );
      });
    });
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
