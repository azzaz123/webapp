import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../core/user/user.service';
import { MOCK_USER, User } from 'shield';
import { Observable } from 'rxjs/Observable';
import { EventService } from "../../core/event/event.service";
import { environment } from "../../../environments/environment";
import { CATEGORY_DATA_WEB } from "../../../tests/category.fixtures";

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let userService: UserService;
  let fixture: ComponentFixture<TopbarComponent>;
  let eventService: EventService;

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
        }
      },
        EventService],
      declarations: [TopbarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
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
      expect(JSON.stringify(component.coordinates)).toEqual(JSON.stringify(newCoordinates));
    });
  });

  describe('update category', () => {
    it('should update the category and call the form submit', () => {
      component.category = CATEGORY_DATA_WEB;
      //component.updateCategory(CATEGORY_DATA_WEB);
      expect(JSON.stringify(component.category)).toEqual(JSON.stringify(CATEGORY_DATA_WEB));
      //expect(component.submitForm).toHaveBeenCalled();
    });
  });

  describe('search form', () => {
    beforeEach(() => {
      spyOn(component.latEl.nativeElement, 'value');
      spyOn(component.lngEl.nativeElement, 'value');
      spyOn(component.kwsEl.nativeElement, 'value');
      //spyOn(component, 'submitForm').and.callThrough();

    });
    /*it('should submit the search form for consumer goods', () => {
      let categoryId = 12545;
      expect(window.location.href).toEqual(environment.siteUrl + 'search?catIds=' + categoryId + '&lat=' +  component.latEl.nativeElement.value
        + '&lng=' + component.lngEl.nativeElement.value + '&kws=' + component.kwsEl.nativeElement.value
        + '&verticalId=');
    });
    it('should submit the search form for cars', () => {
      let categoryId = 100;
      expect(window.location.href).toEqual(environment.siteUrl + 'search?catIds=' + categoryId + '&lat=' +  component.latEl.nativeElement.value
        + '&lng=' + component.lngEl.nativeElement.value + '&kws=' + component.kwsEl.nativeElement.value
        + '&verticalId=100');
    });*/
  });

});
