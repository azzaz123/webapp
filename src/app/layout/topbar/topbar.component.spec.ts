import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../core/user/user.service';
import { MOCK_USER, User, WindowRef } from 'shield';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../core/event/event.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures';
import { environment } from '../../../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let userService: UserService;
  let fixture: ComponentFixture<TopbarComponent>;
  let eventService: EventService;
  let windowRef: WindowRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{
        provide: UserService, useValue: {
          me(): Observable<User> {
            return Observable.of(MOCK_USER);
          },
          logout() {
          }
        },
      },
        { provide: WindowRef, useValue: {
          nativeWindow: {
            location: {
              href: environment.siteUrl
            }
          }
        }},
        EventService],
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
    it('should call the eventService.subscribe passing the update category event', () => {
      spyOn(eventService, 'subscribe').and.callThrough();
      component.ngOnInit();
      expect(eventService.subscribe['calls'].argsFor(1)[0]).toBe(EventService.UPDATE_CATEGORY);
    });
    it('should call the eventService.subscribe passing the update coordinate event', () => {
      spyOn(eventService, 'subscribe').and.callThrough();
      component.ngOnInit();
      expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.UPDATE_COORDINATE);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      spyOn(userService, 'logout');
      component.logout();
    });
    it('should logout', () => {
      expect(userService.logout).toHaveBeenCalled();
    });
  });

  describe('update coordinate', () => {
    let newCoordinates = {"lat": 41.2, "lng": 2.1};
    it('should update the user coordinates', () => {
      component.coordinates = {"lat": 0.0, "lng": 0.0};
      component.updateCoordinate(newCoordinates);
      expect(component.coordinates).toEqual(newCoordinates);
    });
  });

  describe('update category', () => {
    it('should update the category and call the form submit', () => {
      spyOn(component, 'submitForm').and.callThrough();
      component.updateCategory(CATEGORY_DATA_WEB[0]);
      expect(component.category).toEqual(CATEGORY_DATA_WEB[0]);
      expect(component.submitForm).toHaveBeenCalled();
    });
  });

  describe('search form', () => {
    beforeEach(() => {
      component.latEl = {
        nativeElement: {
          value: '42'
        }
      };
      component.lngEl = {
        nativeElement: {
          value: '2'
        }
      };
      component.kwsEl = {
        nativeElement: {
          value: 'iphone'
        }
      };
    });

    it('should redirect to the web when category is set', () => {
      component.category = CATEGORY_DATA_WEB[1];
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
        .toEqual(environment.siteUrl + 'search?catIds=15245' + '&lat=42' + '&lng=2' + '&kws=iphone' + '&verticalId=');
    });

    it('should redirect to the web when category is not set', () => {
      component.categoryEl = {
        nativeElement: {
          value: '15245'
        }
      };
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
        .toEqual(environment.siteUrl + 'search?catIds=15245' + '&lat=42' + '&lng=2' + '&kws=iphone' + '&verticalId=');
    });

    it('should submit the search form for cars', () => {
      component.category = CATEGORY_DATA_WEB[0];
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
        .toEqual(environment.siteUrl + 'search?catIds=100' + '&lat=42' + '&lng=2' + '&kws=iphone' + '&verticalId=100');
    });
  });

});
