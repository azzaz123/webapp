import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { MockUnreadChatMessagesService } from '@fixtures/chat';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ELEMENT_TYPE, INPUT_TYPE, TabbarComponent } from './tabbar.component';
import { TabbarService } from '../core/services/tabbar.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { SearchNavigatorService } from '@core/search/search-navigator.service';

describe('TabbarComponent', () => {
  let component: TabbarComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TabbarComponent>;
  let eventService: EventService;
  let searchNavigatorService: SearchNavigatorService;

  const standaloneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  const homeTabClass: string = '.TabBar__home';

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
          {
            provide: UnreadChatMessagesService,
            useClass: MockUnreadChatMessagesService,
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: SearchNavigatorService,
            useValue: {
              navigateWithLocationParams: () => {},
            },
          },
          EventService,
          TabbarService,
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
    searchNavigatorService = TestBed.inject(SearchNavigatorService);
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
        expect(el.querySelector(accessBtnTextSelector).innerHTML).toEqual('My Zone');
      });
    });

    describe('when user is not logged', () => {
      beforeEach(() => {
        component.isLogged = false;
        fixture.detectChanges();
      });

      it('should show no logged content', () => {
        expect(el.querySelector(accessBtnTextSelector).innerHTML).toEqual('Log in');
      });
    });
  });

  describe('when using a text input: on focus in', () => {
    it('should hide the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.TEXT,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a text input: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.TEXT,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a password input: on focus in', () => {
    it('should hide the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.PASSWORD,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a password input: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.PASSWORD,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a number input: on focus in', () => {
    it('should hide the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.NUMBER,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a number input: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.NUMBER,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a date input: on focus in', () => {
    it('should hide the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.DATE,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a date input: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.DATE,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a radio input: on focus in', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.radio,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a radio input: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.radio,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when using a textarea: on focus in', () => {
    it('should hide the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.TEXT_AREA,
        },
      };
      component.onFocusIn(event);

      expect(component.hidden).toBe(true);
    });
  });

  describe('when using a textarea: on focus out', () => {
    it('should show the tab bar', () => {
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.TEXT_AREA,
        },
      };
      component.onFocusOut(event);

      expect(component.hidden).toBe(false);
    });
  });

  describe('when the user clicks on the home tab', () => {
    it('should open the Search page', () => {
      spyOn(searchNavigatorService, 'navigateWithLocationParams');
      const homeTabEl = fixture.debugElement.query(By.css(homeTabClass)).nativeElement;

      homeTabEl.click();

      expect(searchNavigatorService.navigateWithLocationParams).toHaveBeenCalledWith({});
    });
  });
});
