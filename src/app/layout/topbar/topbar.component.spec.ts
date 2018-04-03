import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../core/event/event.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { environment } from '../../../environments/environment';
import { SUGGESTER_DATA_WEB } from '../../../tests/suggester.fixtures.spec';
import { User } from '../../core/user/user';
import { USER_DATA } from '../../../tests/user.fixtures.spec';
import { WindowRef } from '../../core/window/window.service';
import { MessageService } from '../../core/message/message.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';

const MOCK_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug
);

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let userService: UserService;
  let fixture: ComponentFixture<TopbarComponent>;
  let eventService: EventService;
  let windowRef: WindowRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UserService, useValue: {
            me(): Observable<User> {
              return Observable.of(MOCK_USER);
            }
          },
        },
        {
          provide: WindowRef, useValue: {
            nativeWindow: {
              location: {
                href: environment.siteUrl
              }
            }
          }
        },
        {
          provide: MessageService, useValue: {
          totalUnreadMessages$: Observable.of(1)
        }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        EventService, ...TEST_HTTP_PROVIDERS],
      declarations: [TopbarComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    windowRef = TestBed.get(WindowRef);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the private user variable with the content of the user', () => {
      component.user = null;
      component.ngOnInit();
      expect(component.user).toBe(MOCK_USER);
    });
  });

  describe('update coordinate', () => {
    const newCoordinates = {'latitude': 41.2, 'longitude': 2.1};
    it('should update the user coordinates', () => {
      component.coordinates = {'latitude': 0.0, 'longitude': 0.0};
      component.onCoordinateUpdate(newCoordinates);
      expect(component.coordinates).toEqual(newCoordinates);
    });
  });

  describe('update keyword', () => {
    const newKeyword = 'iphone';
    it('should update the keyword', () => {
      component.kws = 'iphone';
      component.onKeywordUpdate(newKeyword);
      expect(component.kws).toEqual(newKeyword);
    });
  });

  describe('search form', () => {
    beforeEach(() => {
      component.kwsEl = {
        nativeElement: {
          value: 'iphone'
        }
      };
    });

    describe('update category', () => {
      it('should update the category and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onCategoryUpdate(CATEGORY_DATA_WEB[0]);
        expect(component.category).toEqual(CATEGORY_DATA_WEB[0].categoryId);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    describe('update search', () => {
      it('should update the category and keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onSearchUpdate(SUGGESTER_DATA_WEB[0]);
        expect(component.category).toEqual(SUGGESTER_DATA_WEB[0].category_id);
        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    describe('search submit', () => {
      it('should update the keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onSearchSubmit(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    it('should redirect to the web when category is set', () => {
      component.category = CATEGORY_DATA_WEB[1].categoryId;
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=15245' + '&kws=' + '&verticalId=');
    });

    it('should redirect to the web when category is not set', () => {
      component.categoryEl = {
        nativeElement: {
          value: '15245'
        }
      };
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=15245' + '&kws=' + '&verticalId=');
    });

    it('should submit the search form for cars', () => {
      component.category = CATEGORY_DATA_WEB[0].categoryId;
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=100' + '&kws=' + '&verticalId=100');
    });
  });

});
